package com.bs_batch.web.item.repository.review;

import com.bs_batch.web.item.dto.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewRepositoryCustom {

    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId);

}
