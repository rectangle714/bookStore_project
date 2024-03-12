package com.bs_web.web.common.controller;

import com.bs_web.common.code.CategoryType;
import com.bs_web.common.code.EnumMapper;
import com.bs_web.common.code.EnumMapperValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/common")
public class CommonController {

    @Bean
    public EnumMapper enumMapper() {
        EnumMapper enumMapper = new EnumMapper();
        enumMapper.put("CategoryType", CategoryType.class);
        return enumMapper;
    }

    @GetMapping("/category")
    public List<EnumMapperValue> getCategories() {
        return enumMapper().get("CategoryType");
    }
}
