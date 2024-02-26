package com.bootProject.web.item.dto;

import com.bootProject.web.member.entity.Member;
import lombok.Data;

import java.util.List;

@Data
public class PaymentDTO {
    private Long id;
    private String email;
    private Long amount;
    private String impUid;
    private String merchantUid;
    private List<PaymentDTO> paymentList;
    private Member memberId;
}
