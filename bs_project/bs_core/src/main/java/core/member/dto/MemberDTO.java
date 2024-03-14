package core.member.dto;

import core.common.entity.Role;
import core.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private LocalDateTime loginDate;

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

}
