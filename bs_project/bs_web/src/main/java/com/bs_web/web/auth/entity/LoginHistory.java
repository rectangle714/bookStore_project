package com.bs_web.web.auth.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter @Builder
@EntityListeners(AuditingEntityListener.class)
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_history_id")
    private Long id;
    private String userId;

    @CreatedDate
    private LocalDateTime loginDate;

    private String clientIp;
    private String clientOs;
    private String clientBrowser;

}
