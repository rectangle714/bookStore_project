package com.bootProject.web.item;

import com.bootProject.web.item.repository.item.ItemRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;


@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class itemTest {

    @Autowired
    ItemRepository itemRepository;

//    @Test
//    @DisplayName("제품입력")
//    void insert() {
//        List<Item> itemList = new ArrayList<Item>();
//
//        Item item1 = Item.builder()
//                .title("아이템1")
//                .contents("아이템1 내용")
//                .build();
//        itemList.add(item1);
//
//        Item item2 = Item.builder()
//                .title("아이템2")
//                .contents("아이템2 내용")
//                .build();
//        itemList.add(item2);
//
//        itemRepository.saveAll(itemList);
//    }

//    @Test
//    @DisplayName("최근 추가된 책 목록 찾기")
//    void findRecentItemList() {
//        List<Item> itemList = new ArrayList<Item>();
//        List<Item> recentRegisteredItem = itemRepository.findRecentRegisteredItem();
//        for (Item item:recentRegisteredItem) {
//            log.info("item value = {}", item.getId());
//        }
//    }
//
//    @Test
//    @DisplayName("카테고리별 상품 정보 조회")
//    void findItemListByCate() {
//        String cate = null;
//
//        List<Item> fictionList = itemRepository.findListAll(cate);
//        for (Item item:fictionList) {
//            log.info("item value = {}", item.getId());
//        }
//    }

}
