package core.item.mapper;

import core.item.dto.ReviewDTO;
import core.item.entity.Review;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Named("reviewDTOLIst")
    @Mapping(target = "writerEmail", source = "member.email")
    @Mapping(target = "writerNickname", source = "member.nickname")
    @Mapping(target = "registerDate", source = "registerDate")
    public ReviewDTO toDTO(Review review);

    @IterableMapping(qualifiedByName = "reviewDTOLIst")
    public List<ReviewDTO> toDTOList(List<Review> reviewList);

}
