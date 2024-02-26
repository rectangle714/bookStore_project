package com.bootProject.web.item.repository.item;

import com.bootProject.web.item.dto.ItemDTO;
import com.bootProject.web.item.entity.Item;

import java.util.List;

public interface ItemRepositoryCustom {
    public List<Item> findListAll(String cate);
    public ItemDTO findItemById(long id);
    public List<Item> findRecentRegisteredItem();
}
