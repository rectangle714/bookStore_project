package core.item.repository.review;

import core.item.dto.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewRepositoryCustom {

    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId);

}
