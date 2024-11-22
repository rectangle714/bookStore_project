package com.bs_web.web.item.repository.payment;

import com.bs_web.web.item.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
