package com.bootProject.web.cart.dto;

import com.bootProject.web.item.entity.Item;
import com.bootProject.web.member.entity.Member;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class CartDTO {
    //Cart
    private long cartId;
    private long quantity;

    //Item
    private long itemId;
    private Item item;

    //Member
    private String email;
    private Member member;

    //QueryProjection field
    private String title;
    private String contents;
    private Long price;
    private String category;
    private String storedFileName;
    private Long totalBookPrice;
    private String isPaid;

    @QueryProjection
    public CartDTO(Long id, Long quantity, String title, String contents,
                   Long price, String category, String storedFileName, Long totalBookPrice) {
        this.cartId = id;
        this.quantity = quantity;
        this.title = title;
        this.contents = contents;
        this.price = price;
        this.category = category;
        this.storedFileName = storedFileName;
        this.totalBookPrice = totalBookPrice;
    }
}
