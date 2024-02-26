package com.bootProject.web.member.dto;

import com.bootProject.web.common.entity.Role;
import com.bootProject.web.member.entity.Member;
import lombok.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
    private String memberId;
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String role;
    private String authCode;
    private String zipNo;
    private String address;
    private String addressDetail;

    public Member toMember() {
        return Member.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .phone(phone)
                .role(Role.USER)
                .zipNo(zipNo)
                .address(address)
                .addressDetail(addressDetail)
                .build();
    }

    public UsernamePasswordAuthenticationToken toAuthentication() {
        return new UsernamePasswordAuthenticationToken(email, password);
    }

}
