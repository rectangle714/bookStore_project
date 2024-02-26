package com.bootProject.oauth2;

import com.bootProject.web.auth.dto.KakaoLoginDTO;
import com.bootProject.web.auth.dto.NaverLoginDTO;
import retrofit2.Call;
import retrofit2.http.*;

public interface ServerAPIs {

    static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    static final String KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";
    static final String NAVER_USER_INFO_URL = "https://openapi.naver.com/v1/nid/me";

    @POST(KAKAO_TOKEN_URL)
    Call<KakaoLoginDTO> getKakaoToken(
            @Query("grant_type") String grantType,
            @Query("client_id") String clientId,
            @Query(value = "redirect_uri", encoded = true) String redirectUri,
            @Query("code") String code
    );

    @GET(KAKAO_USER_INFO_URL)
    Call<KakaoLoginDTO> getKakaoUserInfo(
            @Header("Authorization") String header
    );

    @GET(NAVER_USER_INFO_URL)
    Call<NaverLoginDTO> getNaverUserInfo(
            @Header("Authorization") String header
    );

}
