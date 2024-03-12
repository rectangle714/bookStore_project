package core.item.repository.item;

import code.CategoryType;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import core.item.dto.ItemDTO;
import core.item.entity.Item;
import core.item.mapper.ItemMapper;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

import static core.item.entity.QItem.item;
import static core.item.entity.QSaveFile.saveFile;

@RequiredArgsConstructor
public class ItemRepositoryImpl implements ItemRepositoryCustom {
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
