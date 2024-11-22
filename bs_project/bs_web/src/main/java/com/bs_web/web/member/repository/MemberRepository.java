package com.bs_web.web.member.repository;

import com.bs_web.web.member.dto.MemberDTO;
import com.bs_web.web.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long>, MemberRepositoryCustom {
    public Optional<Member> findByEmail(String email);

    public boolean existsByEmail(String email);

    @Override
    public List<MemberDTO> findAllMemberList();
}
