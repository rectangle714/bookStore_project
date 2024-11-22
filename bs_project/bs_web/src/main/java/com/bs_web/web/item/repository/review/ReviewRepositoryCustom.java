package com.bs_web.web.item.repository.review;

import com.bs_web.web.item.dto.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewRepositoryCustom {

    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId);

}
