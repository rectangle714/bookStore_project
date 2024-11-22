package com.bs_web.web.item.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {

    private Long id;
    private Long itemId;
    private String email;
    private String contents;
    private String ipAddress;
    private String writerNickname;
    private String writerEmail;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy.MM.dd", timezone = "Asia/Seoul")
    private LocalDateTime registerDate;

}
