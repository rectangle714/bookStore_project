package com.bootProject.web.item.entity;

import com.bootProject.web.common.entity.Base;
import com.bootProject.web.member.entity.Member;
import jakarta.persistence.*;
import jdk.jfr.Description;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends Base {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member memberId;

    @Description("결제금액")
    private Long amount;

    @Description("결제번호")
    private String impUid;

    @Description("주문번호")
    private String merchantUid;

}
