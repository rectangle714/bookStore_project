package com.bs_web.web.member.repository;

import com.bs_web.web.member.dto.MemberDTO;
import com.bs_web.web.member.entity.Member;

import java.util.List;

public interface MemberRepositoryCustom {

    public List<MemberDTO> findAllMemberList();
    public List<MemberDTO> findExpiredMember();

}
