package core.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistoryDTO {

    private Long id;
    private String userId;
    private LocalDateTime loginDate;
    private String clientIp;
    private String userAgent;

}
