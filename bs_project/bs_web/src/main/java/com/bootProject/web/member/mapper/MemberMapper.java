package com.bootProject.web.member.mapper;

import com.bootProject.web.member.dto.MemberDTO;
import com.bootProject.web.member.entity.Member;
import com.bootProject.web.common.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MemberMapper {

    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    @Mapping(target = "memberId", source = "id")
    @Mapping(target = "authCode", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "enumToString")
    public MemberDTO toDTO(Member member);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "role", constant = "USER")
    public Member toMember(MemberDTO memberDTO);

    @Named("enumToString")
    default String enumToString(Role role) {
        return role.toString();
    }

}
