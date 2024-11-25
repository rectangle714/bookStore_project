package com.bs_batch.web.member.repository;

import com.bs_batch.web.member.dto.MemberDTO;
import java.util.List;

public interface MemberRepositoryCustom {

    public List<MemberDTO> findAllMemberList();
    public List<MemberDTO> findExpiredMember();

}
