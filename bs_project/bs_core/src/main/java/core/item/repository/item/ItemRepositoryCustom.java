package core.item.repository.item;

import core.item.dto.ItemDTO;
import core.item.entity.Item;

import java.util.List;

public interface ItemRepositoryCustom {
    public List<Item> findListAll(String cate);
    public ItemDTO findItemById(long id);
    public List<Item> findRecentRegisteredItem();
}
