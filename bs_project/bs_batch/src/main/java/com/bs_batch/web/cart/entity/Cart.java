package com.bs_batch.web.cart.entity;

import com.bs_batch.common.entity.Base;
import com.bs_batch.web.item.entity.Item;
import com.bs_batch.web.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart extends Base {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item itemId;

    @Column(columnDefinition = "VARCHAR(1) default 'N'")
    private String isPaid;

    private long quantity;


    public void updateQuantity(String flag, int quantity) {
        if("increse".equals(flag)) {
            this.quantity = this.quantity + quantity;
        } else {
            this.quantity = this.quantity - quantity;
        }
    }

}
