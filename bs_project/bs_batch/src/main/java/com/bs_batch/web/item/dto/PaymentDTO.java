package com.bs_batch.web.item.dto;

import com.bs_batch.web.member.entity.Member;
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
