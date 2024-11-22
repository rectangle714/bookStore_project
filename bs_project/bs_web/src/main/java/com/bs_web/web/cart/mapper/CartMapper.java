package com.bs_web.web.cart.mapper;

import com.bs_web.web.cart.dto.CartDTO;
import com.bs_web.web.cart.entity.Cart;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartMapper {

    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    @Mapping(target = "memberId", source = "member")
    @Mapping(target = "itemId", source = "item")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public Cart updateFromDto(CartDTO cartDTO);

}
