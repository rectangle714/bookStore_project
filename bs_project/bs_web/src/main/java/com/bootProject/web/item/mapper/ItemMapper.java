package com.bootProject.web.item.mapper;

import com.bootProject.web.item.dto.ItemDTO;
import com.bootProject.web.item.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ItemMapper {
    ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);

    @Mapping(target="itemId", source = "id")
    @Mapping(target="saveFileList", source = "fileList")
    @Mapping(target="fileList", ignore = true)
    @Mapping(target="itemList", ignore = true)
    @Mapping(target="file", ignore = true)
    public ItemDTO toDTO(Item item);


    @Mapping(target="id", source = "itemId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target="fileList", ignore = true)
    public Item toEntity(ItemDTO itemDTO);

}
