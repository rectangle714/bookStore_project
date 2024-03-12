package core.auth.mapper;

import core.auth.dto.LoginHistoryDTO;
import core.auth.entity.LoginHistory;
import core.cart.dto.CartDTO;
import core.cart.entity.Cart;
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
