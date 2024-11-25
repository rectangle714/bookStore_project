package com.bs_batch.web.item.repository.review;

import com.bs_batch.web.item.dto.ReviewDTO;
import com.bs_batch.web.item.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review,Long>, ReviewRepositoryCustom {

    @Override
    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId);

}
