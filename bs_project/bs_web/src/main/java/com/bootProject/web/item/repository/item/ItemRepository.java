package com.bootProject.web.item.repository.item;

import com.bootProject.web.item.dto.ItemDTO;
import com.bootProject.web.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>,  ItemRepositoryCustom{
    @Override
    public List<Item> findListAll(String cate);
    @Override
    public ItemDTO findItemById(long id);
    @Override
    public  List<Item> findRecentRegisteredItem();
}
