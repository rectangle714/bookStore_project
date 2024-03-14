package core.member.repository;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import core.member.dto.MemberDTO;
import core.member.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static core.member.entity.QMember.member;
import static core.auth.entity.QLoginHistory.loginHistory;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<MemberDTO> findAllMembers() {
        List<MemberDTO> memberDtoList = new ArrayList<>();
        memberDtoList =  queryFactory
                .select(Projections.bean(MemberDTO.class,
                        member.id.as("memberId"), member.email, member.nickname,
                        member.registerDate, member.updateDate, member.socialType,
                        ExpressionUtils.as(
                                JPAExpressions.select(loginHistory.loginDate)
                                        .from(loginHistory)
                                        .where(
                                                loginHistory.id.eq(
                                                        JPAExpressions
                                                                .select(loginHistory.id.max())
                                                                .from(loginHistory)
                                                                .where(loginHistory.userId.eq(member.email))
                                                )
                                        ), "loginDate"
                        )))
                .from(member)
                .fetch();
        return memberDtoList;
    }
}
