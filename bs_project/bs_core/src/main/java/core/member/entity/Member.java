package core.member.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import core.common.entity.Base;
import core.common.entity.Role;
import core.common.entity.SocialType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime loginDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime logoutDate;
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


