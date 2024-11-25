package com.bs_batch.web.item.entity;

import com.bs_batch.common.entity.Base;
import com.bs_batch.web.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends Base {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;

    private String contents;

    private String ipAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    public Review(String contents, String ipAddress, Member member, Item item) {
        this.contents = contents;
        this.ipAddress = ipAddress;
        this.member = member;
        this.item = item;
    }

}
