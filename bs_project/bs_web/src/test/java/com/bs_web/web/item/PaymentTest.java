package com.bs_web.web.item;

import core.cart.repository.CartRepository;
import core.item.dto.PaymentDTO;
import core.item.entity.Payment;
import core.item.mapper.PaymentMapper;
import core.item.repository.payment.PaymentRepository;
import core.member.entity.Member;
import core.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@SpringBootTest
public class PaymentTest {

    @Autowired private MemberRepository memberRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private CartRepository cartRepository;

    @Test
    @Transactional
    void processPaymentTest() {
        Member admin = memberRepository.findByEmail("admin").get();
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setImpUid("testUid");
        paymentDTO.setMerchantUid("testMerchantUid");
        paymentDTO.setMemberId(admin);
        paymentDTO.setAmount(1000L);
        Payment payment = PaymentMapper.INSTANCE.toPayment(paymentDTO);
        paymentRepository.save(payment);

        List<Long> ids = new ArrayList<>();
        ids.add(12L);
        ids.add(16L);
        ids.add(17L);
        ids.add(18L);
        ids.add(19L);
        ids.add(21L);
        cartRepository.updateCartIsPaid(ids);
    }

}
