package com.bs_web.web.item.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.bs_web.common.entity.Base;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Table(name = "file")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SaveFile extends Base {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long file_id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    private String originFileName;
    private String storedFileName;
    private Long fileSize;
}
