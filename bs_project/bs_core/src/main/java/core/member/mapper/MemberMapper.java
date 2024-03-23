package core.member.mapper;

import core.common.entity.Role;
import core.member.dto.MemberDTO;
import core.member.entity.Member;
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

    @Mapping(target = "id", source = "memberId")
    @Mapping(target = "role", source = "role")
    public Member toMemberBatch(MemberDTO memberDTO);

    @Named("enumToString")
    default String enumToString(Role role) {
        return role.toString();
    }

}
