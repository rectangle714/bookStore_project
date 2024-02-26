package com.bootProject.web.common.entity;

import com.bootProject.web.common.entity.Base;
import com.bootProject.web.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Table(name = "buy")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Buy extends Base {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "buy_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    
    private String resName;    //받은사람이름
    private String resAddress; //받는사람 주소
    private String resPhone;   //받는 사람 핸드폰번호
    private String resRequirement; //받는사람 요청사항
    private Long totalPrice;   //합계

}
