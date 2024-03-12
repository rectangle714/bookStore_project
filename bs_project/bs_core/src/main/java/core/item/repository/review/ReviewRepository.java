package core.item.repository.review;

import core.item.dto.ReviewDTO;
import core.item.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review,Long>, ReviewRepositoryCustom {

    @Override
    public Page<ReviewDTO> findReviewList(Pageable pageable, String itemId);

}
