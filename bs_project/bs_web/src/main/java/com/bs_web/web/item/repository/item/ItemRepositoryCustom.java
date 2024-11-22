package com.bs_web.web.item.repository.item;

import com.bs_web.web.item.dto.ItemDTO;
import com.bs_web.web.item.entity.Item;

import java.util.List;

public interface ItemRepositoryCustom {
    public List<Item> findListAll(String cate);
    public ItemDTO findItemById(long id);
    public List<Item> findRecentRegisteredItem();
}
