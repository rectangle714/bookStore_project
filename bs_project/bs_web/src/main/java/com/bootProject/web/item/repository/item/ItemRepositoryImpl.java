package com.bootProject.web.item.repository.item;

import com.bootProject.common.code.CategoryType;
import com.bootProject.web.item.dto.ItemDTO;
import com.bootProject.web.item.entity.Item;
import com.bootProject.web.item.mapper.ItemMapper;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

import static com.bootProject.web.item.entity.QItem.item;
import static com.bootProject.web.item.entity.QSaveFile.saveFile;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
public class ItemRepositoryImpl implements ItemRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Item> findListAll(String cate) {
        return queryFactory
                .selectFrom(item)
                .leftJoin(item.fileList, saveFile).fetchJoin()
                .where(eqCategory(cate))
                .orderBy(item.registerDate.desc())
                .fetch();
    }

    private BooleanExpression eqCategory(String cate) {
        if(StringUtils.isEmpty(cate)) {
            return null;
        }
        return item.category.eq(cate);
    }

    @Override
    public ItemDTO findItemById(long id) {
        Item resultItem = queryFactory
                .select(item)
                .from(item)
                .innerJoin(item.fileList, saveFile)
                .where(item.id.eq(id))
                .fetchOne();

        ItemDTO itemDTO = ItemMapper.INSTANCE.toDTO(resultItem);
        if(null != itemDTO.getCategory()) {
            CategoryType categoryType = Arrays.stream(CategoryType.values())
                    .filter(category -> category.getCode().equals(itemDTO.getCategory()))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
            itemDTO.setCategory(categoryType != null ? categoryType.getTitle() : "");
        }

        return itemDTO;
    }

    @Override
    public List<Item> findRecentRegisteredItem() {
        List<Long> itemIds = queryFactory
                .select(item.id)
                .from(item)
                .orderBy(item.registerDate.desc())
                .offset(0)
                .limit(14)
                .fetch();

        return queryFactory
                .selectFrom(item)
                .leftJoin(item.fileList,saveFile).fetchJoin()
                .where(item.id.in(itemIds))
                .orderBy(item.registerDate.desc())
                .fetch();
    }
}
