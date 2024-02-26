package com.bootProject.web.item.dto;

import com.bootProject.web.item.entity.SaveFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDTO {
    private long itemId;
    private String title;
    private String contents;
    private long price;
    private String category;
    private List<String> itemList;
    private List<String> fileList;
    private List<SaveFile> saveFileList;
    private List<MultipartFile> file;

}
