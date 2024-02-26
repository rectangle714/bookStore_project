package com.bootProject.web.member.entity;

import com.bootProject.oauth2.SocialType;
import com.bootProject.web.common.entity.Base;
import com.bootProject.web.common.entity.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends Base {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    private String name;
    private String email;
    private String password;
    private String phone;
    private String nickname;
    private String zipNo;
    private String address;
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String socialId; // 로그인한 소셜 타입의 식별자 값 (일반 로그인인 경우 null)
    @Enumerated(EnumType.STRING)
    private SocialType socialType; // KAKAO, NAVER, GOOGLE


    public void updateMember(String password, String phone , String nickname, String zipNo, String address, String addressDetail) {
        this.password = password;
        this.phone = phone;
        this.nickname = nickname;
        this.zipNo = zipNo;
        this.address = address;
        this.addressDetail = addressDetail;
    }

    public void updateMemberPassword(String password) {
        this.password = password;
    }
}


