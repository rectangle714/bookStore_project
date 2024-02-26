package com.bootProject.web.item.repository.payment;

import com.bootProject.web.item.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
