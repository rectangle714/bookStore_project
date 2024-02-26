package com.bootProject.web.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
public class NaverLoginDTO {

    private Map<String, Object> response;
    private String socialId;
    private String email;
    private String name;

    public NaverLoginDTO(Map<String, Object> response) {
        this.socialId = (String)response.get("id");
        this.email = (String)response.get("email");
        this.name = (String)response.get("name");
    }


}
