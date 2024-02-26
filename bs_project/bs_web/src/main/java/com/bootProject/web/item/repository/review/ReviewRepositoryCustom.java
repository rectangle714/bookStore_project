package com.bootProject.web.item.repository.review;

import com.bootProject.web.item.dto.ReviewDTO;
import com.bootProject.web.item.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewRepositoryCustom {

    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId);

}
