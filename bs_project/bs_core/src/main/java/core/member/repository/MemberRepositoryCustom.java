package core.member.repository;

import core.member.dto.MemberDTO;
import core.member.entity.Member;

import java.util.List;

public interface MemberRepositoryCustom {

    public List<MemberDTO> findAllMemberList();
    public List<MemberDTO> findExpiredMember();

}
