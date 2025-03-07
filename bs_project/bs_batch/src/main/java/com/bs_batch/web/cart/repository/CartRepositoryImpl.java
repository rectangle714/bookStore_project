package com.bs_batch.web.cart.repository;

import com.bs_batch.web.cart.dto.CartDTO;
import com.bs_batch.web.cart.entity.Cart;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.ArrayList;
import java.util.List;

import static com.bs_batch.web.cart.entity.QCart.cart;
import static com.bs_batch.web.item.entity.QItem.item;
import static com.bs_batch.web.item.entity.QSaveFile.saveFile;
import static com.bs_batch.web.member.entity.QMember.member;

@RequiredArgsConstructor
public class CartRepositoryImpl implements CartRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    @Override
    public List<CartDTO> selectCartList(String email) {
        List<CartDTO> cartList = new ArrayList<CartDTO>();
        cartList = queryFactory
                .select(
                        Projections.constructor(
                                CartDTO.class, cart.id, cart.quantity,
                                item.title,item.contents, item.price, item.category,
                                saveFile.storedFileName
                        )
                )
                .from(cart)
                .innerJoin(cart.memberId, member)
                .innerJoin(cart.itemId, item)
                .innerJoin(item.fileList, saveFile)
                .where(member.email.eq(email).and(cart.isPaid.eq("N")))
                .fetch();
        return cartList;
    }

    @Override
    public Cart selectByItemIdAndMemberId(Long itemId, Long memberId) {
        return queryFactory
                .select(cart)
                .from(cart)
                .innerJoin(cart.itemId, item).fetchJoin()
                .innerJoin(cart.memberId, member).fetchJoin()
                .where(
                    member.id.eq(memberId).and(item.id.eq(itemId)).and(cart.isPaid.eq("N"))
                ).fetchOne();
    }

    @Override
    public Page<CartDTO> selectCartPage(Pageable pageable, String email) {
        List<CartDTO> cartList = new ArrayList<CartDTO>();
        cartList = queryFactory
                .select(
                        Projections.constructor(
                                CartDTO.class, cart.id, cart.quantity,
                                item.title,item.contents, item.price, item.category,
                                saveFile.storedFileName,
                                ExpressionUtils.as(
                                        JPAExpressions.select(item.price.multiply(cart.quantity).sum().as("totalBookPrice"))
                                                .from(cart)
                                                .innerJoin(cart.memberId, member)
                                                .innerJoin(cart.itemId, item)
                                                .where(member.email.eq(email).and(cart.isPaid.eq("N"))), "totalBookPrice"
                                )
                        )
                )
                .from(cart)
                .innerJoin(cart.memberId, member)
                .innerJoin(cart.itemId, item)
                .innerJoin(item.fileList, saveFile)
                .where(member.email.eq(email).and(cart.isPaid.eq("N")))
                .orderBy(cart.id.desc())
                .offset(pageable.getOffset())       //페이지 번호
                .limit(pageable.getPageSize())      // 페이지 사이즈
                .fetch();

        JPAQuery<Long> count = queryFactory
                .select(cart.count())
                .from(cart)
                .innerJoin(cart.memberId, member)
                .innerJoin(cart.itemId, item)
                .innerJoin(item.fileList, saveFile)
                .where(member.email.eq(email));

        return PageableExecutionUtils.getPage(cartList, pageable, count::fetchOne);
    }

    @Override
    public void updateCartIsPaid(List<Long> ids) {
        long count = queryFactory
                .update(cart)
                .set(cart.isPaid, "Y")
                .where(cart.id.in(ids))
                .execute();
    }
}
