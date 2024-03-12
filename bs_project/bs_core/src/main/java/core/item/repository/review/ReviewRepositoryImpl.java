package core.item.repository.review;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import core.item.dto.ReviewDTO;
import core.item.entity.Review;
import core.item.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.ArrayList;
import java.util.List;

import static core.item.entity.QItem.item;
import static core.item.entity.QReview.review;
import static core.member.entity.QMember.member;

@RequiredArgsConstructor
public class ReviewRepositoryImpl implements ReviewRepositoryCustom {

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
