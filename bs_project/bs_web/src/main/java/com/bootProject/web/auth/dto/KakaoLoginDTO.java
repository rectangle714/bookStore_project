package com.bootProject.web.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class KakaoLoginDTO {

    /** 토큰 발급 **/
    private String code;
    private String redirectUri;
    private String clientId;
    private String access_token;
    private String refresh_token;
    /****/

    /** 사용자 정보 **/
    private Map<String, Object> kakao_account;
    /****/
}
