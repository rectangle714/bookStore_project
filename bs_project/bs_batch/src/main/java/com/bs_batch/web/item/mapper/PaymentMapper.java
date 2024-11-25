package com.bs_batch.web.item.mapper;

import com.bs_batch.web.item.dto.PaymentDTO;
import com.bs_batch.web.item.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PaymentMapper {

    PaymentMapper INSTANCE = Mappers.getMapper(PaymentMapper.class);

    @Mapping(target = "memberId" , source = "memberId")
    public Payment toPayment(PaymentDTO paymentDTO);

}
