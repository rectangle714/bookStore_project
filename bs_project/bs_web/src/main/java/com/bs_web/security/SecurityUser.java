package com.bs_web.security;

import com.bs_web.web.member.dto.MemberDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.bs_web.web.member.dto.MemberDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@ToString
public class SecurityUser extends User {

    private long memberId;
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private String role;
    private String socialType;
    private String authCode;
    private String zipNo;
    private String address;
    private String addressDetail;
    private String expiredYn;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime loginDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime registerDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updateDate;

    public SecurityUser(MemberDTO memberDTO) {
        super(memberDTO.getEmail(), memberDTO.getPassword() == null ? "" : memberDTO.getPassword(),
                makeGrantedAuthority(memberDTO.getRole()));
        this.memberId = memberDTO.getMemberId();
        this.password = memberDTO.getPassword();
        this.email = memberDTO.getEmail();
        this.nickname = memberDTO.getNickname();
        this.phone = memberDTO.getPhone();
        this.role = memberDTO.getRole();
        this.socialType = memberDTO.getSocialType();
        this.authCode = memberDTO.getAuthCode();
        this.zipNo = memberDTO.getZipNo();
        this.address = memberDTO.getAddress();
        this.addressDetail = memberDTO.getAddressDetail();
        this.expiredYn = memberDTO.getExpiredYn();
        this.loginDate = memberDTO.getLoginDate();
        this.registerDate = memberDTO.getRegisterDate();
        this.updateDate = memberDTO.getUpdateDate();
    }

    private static Set<GrantedAuthority> makeGrantedAuthority(String role){
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(role);
        return Collections.singleton(grantedAuthority);
    }

}
