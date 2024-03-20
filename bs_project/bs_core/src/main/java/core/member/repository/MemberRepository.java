package core.member.repository;

import core.member.dto.MemberDTO;
import core.member.entity.Member;
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
