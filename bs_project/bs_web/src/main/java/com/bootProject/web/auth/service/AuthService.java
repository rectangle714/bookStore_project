package com.bootProject.web.auth.service;

import com.bootProject.web.auth.dto.NaverLoginDTO;
import com.bootProject.web.member.mapper.MemberMapper;
import com.bootProject.oauth2.ServerAPIs;
import com.bootProject.common.util.CookieUtil;
import com.bootProject.common.util.RedisUtil;
import com.bootProject.common.code.ErrorCode;
import com.bootProject.common.exception.BusinessException;
import com.bootProject.web.auth.dto.KakaoLoginDTO;
import com.bootProject.web.member.dto.MemberDTO;
import com.bootProject.security.TokenDTO;
import com.bootProject.web.member.entity.Member;
import com.bootProject.web.common.entity.Role;
import com.bootProject.jwt.TokenProvider;
import com.bootProject.oauth2.SocialType;
import com.bootProject.web.member.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import retrofit2.Call;
import retrofit2.Response;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManagerBuilder managerBuilder;
    private final ServerAPIs serverAPIs;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RedisUtil redisUtil;
    private final CookieUtil cookieUtil;
    @Value(value = "${jwt.token.accessTokenExpireTime}")
    private long accessTokenExpireTime;
    @Value(value = "${jwt.token.refreshTokenExpireTime}")
    private long refreshTokenExpireTime;

    /** 네이버 로그인 관련 config 값 **/
    @Value("${spring.security.oauth2.client.provider.naver.authorization-uri}")
    private String naverUrl;
    @Value("${spring.security.oauth2.client.provider.naver.token-uri}")
    private String naverTokenUri;
    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;
    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;
    @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
    private String naverRedirectUri;

    /** 카카오 로그인 관련 config 값 **/
//    @Value("${spring.security.oauth2.client.registration.kakao.base-uri}")
//    private String kakaoUri;
    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;
    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Transactional
    public String signup(MemberDTO requestDto) throws BusinessException {
        MemberDTO memberDTO = new MemberDTO();
        if(!memberRepository.existsByEmail(requestDto.getEmail())) {
            requestDto.setPassword(passwordEncoder.encode(requestDto.getPassword()));
            Member member = MemberMapper.INSTANCE.toMember(requestDto);
            memberRepository.save(member);
            return "success";
        }else {
            log.debug("이미 가입되어 있는 유저입니다.");
            throw new BusinessException(ErrorCode.DUPLICATE_LOGIN_ID, ErrorCode.DUPLICATE_LOGIN_ID.getDescription());
        }
    }

    @Transactional
    public TokenDTO login(MemberDTO requestDto) {
        UsernamePasswordAuthenticationToken authenticationToken = requestDto.toAuthentication();
        Authentication authentication = managerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        TokenDTO token = new TokenDTO();
        token = tokenProvider.generateTokenDto(authentication);
        redisUtil.setData(authentication.getName(), token.getRefreshToken(), token.getRefreshTokenExpiresIn());

        return token;
    }

    @Transactional
    public void logOut(HttpServletRequest request, HttpServletResponse response) {
        try {
            Cookie cookie = cookieUtil.getCookie(request, "accessToken");
            String accessToken = cookie.getValue();
            String memberId = tokenProvider.parseClaims(accessToken).getSubject();

            // 레디스 refreshtoken 제거
            redisUtil.deleteData(memberId);

            Long expiration = (tokenProvider.parseClaims(accessToken).getExpiration().getTime() - (new Date().getTime()));
            if(expiration <= 0){
                expiration = 1L;
            }
            redisUtil.setBlackList(accessToken, "access_token", expiration);

            cookieUtil.expiringCookie(request, response, "accessToken");
        } catch (NullPointerException e) {
            log.debug("[로그아웃] 쿠키가 비어있습니다.");
        }
    }

    /** 네이버 사용자 정보 요청후 토큰처리 **/
    public TokenDTO getNaverUserByToken(String token) {
        String accessToken = token;

        Call<NaverLoginDTO> naverUserInfoCall = serverAPIs.getNaverUserInfo("bearer " + accessToken);
        try {
            Response<NaverLoginDTO> naverUserInfo = naverUserInfoCall.execute();
            if(naverUserInfo.isSuccessful()) {
                if (null != naverUserInfo.body().getResponse()) {
                    NaverLoginDTO userInfo = new NaverLoginDTO(naverUserInfo.body().getResponse());
                    // email로 확인 후 있으면 로그인 없으면 사용자 저장
                    Member member = memberRepository.findByEmail(userInfo.getEmail()).orElse(null);
                    TokenDTO newToken = new TokenDTO();
                    if(member != null) {
                        newToken = tokenProvider.generateTokenDtoByOauth(member.getEmail());
                        redisUtil.setData(member.getEmail(), newToken.getRefreshToken(), newToken.getRefreshTokenExpiresIn());
                    } else {
                        Member guest = Member.builder()
                                .email(userInfo.getEmail())
                                .name(userInfo.getName())
                                .role(Role.GUEST)
                                .socialId(userInfo.getSocialId())
                                .socialType(SocialType.NAVER)
                                .build();
                        guest = memberRepository.save(guest);
                        newToken = tokenProvider.generateTokenDtoByOauth(guest.getEmail());
                        redisUtil.setData(guest.getEmail(), newToken.getRefreshToken(), newToken.getRefreshTokenExpiresIn());
                    }

                    Authentication auth = null;
                    auth = tokenProvider.getAuthentication(newToken.getAccessToken());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    return newToken;
                }
            }
        } catch(IOException e) {
            log.error("네이버 로그인 에러 발생");
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 카카오 토큰으로 사용자 정보 조회 요청
     * 사용자 정보 토큰 처리
     **/
    public TokenDTO getKakaoUserByToken(KakaoLoginDTO param) {
        KakaoLoginDTO kakaoLoginDTO = getKakaoToken(param);
        if(kakaoLoginDTO != null) {
            String header = "Bearer "+kakaoLoginDTO.getAccess_token();
            Call<KakaoLoginDTO> kakaoUserInfoCall = serverAPIs.getKakaoUserInfo(header);
            try {
                Response<KakaoLoginDTO> response = kakaoUserInfoCall.execute();
                if (response.isSuccessful()) {
                    Map<String, Object> profile = (Map<String, Object>) response.body().getKakao_account().get("profile");
                    String userEmail = (String) response.body().getKakao_account().get("email");
                    String nickname = (String) profile.get("nickname");

                    Member member = memberRepository.findByEmail(userEmail).orElse(null);
                    TokenDTO newToken = new TokenDTO();
                    if(member != null) {
                        newToken = tokenProvider.generateTokenDtoByOauth(member.getEmail());
                        redisUtil.setData(member.getEmail(), newToken.getRefreshToken(), newToken.getRefreshTokenExpiresIn());
                    } else {
                        Member guest = Member.builder()
                                .email(userEmail)
                                .nickname(nickname)
                                .role(Role.GUEST)
                                .socialType(SocialType.KAKAO)
                                .build();
                        guest = memberRepository.save(guest);
                        newToken = tokenProvider.generateTokenDtoByOauth(guest.getEmail());
                        redisUtil.setData(guest.getEmail(), newToken.getRefreshToken(), newToken.getRefreshTokenExpiresIn());
                    }

                    Authentication auth = null;
                    auth = tokenProvider.getAuthentication(newToken.getAccessToken());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    return newToken;

                }
            } catch (IOException e) {
                log.error("카카오 사용자 정보 조회중 에러발생");
                log.error(e.getMessage());
            }
        }

        return null;
    }

    /** 카카오 토큰 요청 로직 **/
    private KakaoLoginDTO getKakaoToken(KakaoLoginDTO param) {
        String clientId = param.getClientId();
        String redirectUri = param.getRedirectUri();
        String grantType = "authorization_code";
        String code = param.getCode();

        KakaoLoginDTO kakaoLoginDTO = new KakaoLoginDTO();
        Call<KakaoLoginDTO> kakaoTokenCall = serverAPIs.getKakaoToken(grantType, clientId, redirectUri, code);
        try {
            Response<KakaoLoginDTO> response = kakaoTokenCall.execute();
            if(response.isSuccessful()) {
                log.info(response.toString());
                kakaoLoginDTO = response.body();
            }
        } catch(IOException e) {
            log.error("카카오 토큰 요청 에러 발생");
            log.error(e.getMessage());
        }
        return kakaoLoginDTO;
    }

    /** 카카오 토큰 요청 로직 **/
    private KakaoLoginDTO getKakaoUserInfo(KakaoLoginDTO param) {
        String clientId = param.getClientId();
        String redirectUri = param.getRedirectUri();
        String grantType = "authorization_code";
        String code = param.getCode();

        KakaoLoginDTO kakaoLoginDTO = new KakaoLoginDTO();
        Call<KakaoLoginDTO> call = serverAPIs.getKakaoToken(grantType, clientId, redirectUri, code);
        try {
            Response<KakaoLoginDTO> response = call.execute();
            if(response.isSuccessful()) {
                log.info(response.toString());
                kakaoLoginDTO = response.body();
            }
        } catch(IOException e) {
            log.error("카카오 토큰 요청 에러 발생");
            log.error(e.getMessage());
        }

        return kakaoLoginDTO;
    }


}
