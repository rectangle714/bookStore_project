package com.bs_batch.web.item.repository.item;

import com.bs_batch.web.item.dto.ItemDTO;
import com.bs_batch.web.item.entity.Item;

import java.util.List;

public interface ItemRepositoryCustom {
    public List<Item> findListAll(String cate);
    public ItemDTO findItemById(long id);
    public List<Item> findRecentRegisteredItem();
}
