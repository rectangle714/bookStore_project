package com.bootProject.jwt;

import com.bootProject.common.code.ErrorCode;
import com.bootProject.common.util.RedisUtil;
import com.bootProject.security.TokenDTO;
import com.bootProject.security.CustomUserDetailsService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class TokenProvider {
    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "bearer";

    private final long accessTokenExpireTime;
    private final long refreshTokenExpireTime;
    private final SecretKey tokenKey;
    private final RedisUtil redisUtil;
    private final CustomUserDetailsService userDetailsService;

    public TokenProvider(
            @Value(value = "${jwt.token.tokenKey}") final String tokenKey,
            @Value(value = "${jwt.token.accessTokenExpireTime}") final long accessTokenExpireTime,
            @Value(value = "${jwt.token.refreshTokenExpireTime}") final long refreshTokenExpireTime,
            RedisUtil redisUtil,
            CustomUserDetailsService userDetailsService) {
        this.tokenKey = Keys.hmacShaKeyFor(tokenKey.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpireTime = accessTokenExpireTime;
        this.refreshTokenExpireTime = refreshTokenExpireTime;
        this.redisUtil = redisUtil;
        this.userDetailsService = userDetailsService;
    }

    /* TokenDTO에 access, refresh 토큰 값을 담아준다. */
    public TokenDTO generateTokenDto(Authentication authentication) {
        long now = (new Date()).getTime();
        Date accessTokenExpiresIn = new Date(now + accessTokenExpireTime);
        Date refreshTokenExpiresIn = new Date(now + refreshTokenExpireTime);

        String accessToken = generateAccessToken(authentication.getName());
        String refreshToken = generateRefreshToken(authentication.getName());

        log.info("accessToken = {}", accessToken);
        log.info("refreshToken = {}", refreshToken);

        return TokenDTO.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(accessTokenExpiresIn.getTime())
                .refreshTokenExpiresIn(refreshTokenExpiresIn.getTime())
                .build();
    }

    /* TokenDTO에 access, refresh 토큰 값을 담아준다. (oauth 로그인)  */
    public TokenDTO generateTokenDtoByOauth(String email) {
        long now = (new Date()).getTime();
        Date accessTokenExpiresIn = new Date(now + accessTokenExpireTime);
        Date refreshTokenExpiresIn = new Date(now + refreshTokenExpireTime);

        String accessToken = generateAccessToken(email);
        String refreshToken = generateRefreshToken(email);

        log.info("accessToken = {}", accessToken);
        log.info("refreshToken = {}", refreshToken);

        return TokenDTO.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(accessTokenExpiresIn.getTime())
                .refreshTokenExpiresIn(refreshTokenExpiresIn.getTime())
                .build();
    }

    /* 생성할 Access토큰 정보 입력  */
    public String generateAccessToken(String memberId) {
        Date now = new Date();
        Date accessTokenExpiresIn = new Date(now.getTime() + accessTokenExpireTime);
        Claims claims = Jwts.claims().setSubject(memberId);

        String accessToken = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(accessTokenExpiresIn)
                .signWith(tokenKey, SignatureAlgorithm.HS256)
                .compact();
        return accessToken;
    }

    /* 생성할 refresh토큰 정보 입력 */
    public String generateRefreshToken(String memberId) {
        Date now = new Date();
        Date expiresIn = new Date(now.getTime() + refreshTokenExpireTime);
        Claims claims = Jwts.claims().setSubject(memberId);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiresIn)
                .signWith(tokenKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /* 토큰 정보 확인 */
    public Authentication getAuthentication(String accessToken) {
        String memberId = getSubjectFromToken(accessToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(memberId);
        return new UsernamePasswordAuthenticationToken(userDetails, accessToken, userDetails.getAuthorities());
    }

    /* 토큰 만료시간 조회 */
    public Long getExpiration(String accessToken) {
        Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(tokenKey).build().parseClaimsJws(accessToken);
        Date tokenExpirationDate = claims.getBody().getExpiration();
        long now = new Date().getTime();

        return (tokenExpirationDate.getTime() - now);
    }

    /* 토큰 validation */
    public boolean validateToken(String token, HttpServletRequest request) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(tokenKey).build().parseClaimsJws(token);
            Date tokenExpirationDate = claims.getBody().getExpiration();
            validationTokenExpiration(tokenExpirationDate);

            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
            request.setAttribute("exception", ErrorCode.WRONG_TYPE_TOKEN.getCode());
        } catch (ExpiredJwtException e) {
            log.error("Access Token이 만료되었습니다.");
            request.setAttribute("exception", ErrorCode.EXPIRED_TOKEN.getCode());
        } catch (JwtException | IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
            request.setAttribute("exception", ErrorCode.WRONG_TYPE_TOKEN.getCode());
        }
        return false;
    }

    /* 토큰 만료시간 validation */
    public void validationTokenExpiration(Date tokenExpirationDate) {
        if(tokenExpirationDate.before(new Date())) {
            throw new RuntimeException("토큰 시간이 만료되었습니다.");
        }
    }

    /* accessToken의 Claims 가져오기 */
    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(tokenKey).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    /**
     * Access 토큰으로부터 클레임을 만들고 sub(memberId)를 반환
     * @param token
     * @return
     */
    public String getSubjectFromToken(String token) {
        Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(tokenKey).build().parseClaimsJws(token);
        return claims.getBody().getSubject();
    }

    /* 헤더에 access토큰 값 입력 */
    public void setHeaderAccessToken(HttpServletResponse response, String accessToken) {
        response.setHeader("Authorization", "bearer "+ accessToken);
    }

    /* 헤더에 refresh토큰 값 입력 */
    public void setHeaderRefreshToken(HttpServletResponse response, String refreshToken) {
        response.setHeader("RefreshToken", "bearer "+ refreshToken);
    }

}
