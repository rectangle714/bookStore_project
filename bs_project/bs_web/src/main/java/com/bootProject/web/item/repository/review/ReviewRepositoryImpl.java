package com.bootProject.web.item.repository.review;

import com.bootProject.web.item.dto.ReviewDTO;
import static com.bootProject.web.item.entity.QItem.item;
import static com.bootProject.web.item.entity.QReview.review;
import static com.bootProject.web.member.entity.QMember.member;

import com.bootProject.web.item.entity.Review;
import com.bootProject.web.item.mapper.ReviewMapper;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class ReviewRepositoryImpl implements ReviewRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId) {
        ReviewMapper reviewMapper = ReviewMapper.INSTANCE;
        List<Review> reviewList = new ArrayList<>();
        reviewList = queryFactory
                .selectFrom(review)
                .join(review.member, member).fetchJoin()
                .where(item.id.eq(Long.parseLong(itemId)))
                .orderBy(review.registerDate.desc())
                .offset(pageable.getOffset())       //페이지 번호
                .limit(pageable.getPageSize())      // 페이지 사이즈
                .fetch();
        List<ReviewDTO> reviewDTOList = reviewMapper.toDTOList(reviewList);

        JPAQuery<Long> count = queryFactory
                .select(review.count())
                .from(review)
                .join(review.member, member)
                .where(item.id.eq(Long.parseLong(itemId)));

        return PageableExecutionUtils.getPage(reviewDTOList, pageable, count::fetchOne);
    }
}
