package com.bs_web.web.member.repository;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.SubQueryExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.EnumExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.bs_web.common.entity.Role;
import com.bs_web.common.entity.SocialType;
import com.bs_web.web.member.dto.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;

import static com.bs_web.web.member.entity.QMember.member;
import static com.bs_web.web.auth.entity.QLoginHistory.loginHistory;

@Slf4j
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<MemberDTO> findAllMemberList() {
        List<MemberDTO> memberDtoList = new ArrayList<>();
        memberDtoList = queryFactory
                .select(Projections.bean(MemberDTO.class,
                        member.id.as("memberId"), member.email, member.nickname, member.socialType.stringValue().as("socialType"),
                        member.registerDate, member.updateDate, member.role.stringValue().as("role"),
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

    @Override
    public List<MemberDTO> findExpiredMember() {
        List<MemberDTO> memberDtoList = new ArrayList<>();
        EnumExpression<Role> role = member.role;
        EnumExpression<SocialType> socialType = member.socialType;

        memberDtoList = queryFactory
                .select(Projections.bean(MemberDTO.class,
                        member.id.as("memberId"), member.email,member.name, member.nickname, role.stringValue().as("role"),
                        member.password, member.phone, member.socialId, socialType.stringValue().as("socialType"),
                        member.address, member.addressDetail, member.zipNo,
                        member.registerDate, member.updateDate, member.expiredYn,
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
