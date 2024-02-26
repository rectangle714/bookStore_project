package com.bootProject.jwt;

import com.bootProject.common.util.RedisUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String REFRESHTOKEN_HEADER = "RefreshToken";
    public static final String BEARER_PREFIX = "Bearer ";
    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;

    /* 요청 헤더에서 RequestToken 값 조회 */
    private String resolveAccessToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /* 요청 헤더에서 RequestToken 값 조회 */
    private String resolveRefreshToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(REFRESHTOKEN_HEADER);
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = resolveAccessToken(request);
        String refreshToken = resolveRefreshToken(request);

        try {
            // 액세스 토큰 블랙리스트 체크
            if(null != accessToken){
                if(!redisUtil.hasKeyBlackList(accessToken)) {
                    Authentication auth = null;

                    if (StringUtils.hasText(accessToken) && tokenProvider.validateToken(accessToken, request)) {
                        auth = tokenProvider.getAuthentication(accessToken);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    } else {
                        boolean validationRefreshToken = tokenProvider.validateToken(refreshToken, request);

                        if(validationRefreshToken) {
                            String memberEmail = tokenProvider.getSubjectFromToken(refreshToken);
                            String redisRefreshToken = redisUtil.getData(memberEmail);
                            //토큰 재발급
                            if(redisRefreshToken != null){
                                String token = tokenProvider.generateAccessToken(memberEmail);
                                auth = tokenProvider.getAuthentication(token);
                                tokenProvider.setHeaderAccessToken(response, token);
                                SecurityContextHolder.getContext().setAuthentication(auth);
                            } else {
                                logger.debug("Redis에 존재하지 않는 refreshToken");
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);

    }
}
