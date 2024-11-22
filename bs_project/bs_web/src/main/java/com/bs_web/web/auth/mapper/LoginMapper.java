package com.bs_web.web.auth.mapper;

import com.bs_web.web.auth.dto.LoginHistoryDTO;
import com.bs_web.web.auth.entity.LoginHistory;
import com.bs_web.web.cart.dto.CartDTO;
import com.bs_web.web.cart.entity.Cart;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LoginMapper {

    LoginMapper INSTANCE = Mappers.getMapper(LoginMapper.class);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public LoginHistory updateFromDto(LoginHistoryDTO loginHistoryDTO);


}
