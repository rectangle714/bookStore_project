package com.bs_batch.web.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistoryDTO {

    private Long id;
    private String userId;
    private LocalDateTime loginDate;
    private String clientIp;
    private String clientOs;
    private String clientBrowser;

}
