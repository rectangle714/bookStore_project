package com.bootProject.common.code;

public enum CategoryType implements EnumMapperType{
    ESSAY("에세이"),
    FICTION("소설"),
    SELF_IMPROVEMENT("자기계발"),
    HUMANITIES("인문");

    private String title;

    CategoryType(String title) { this.title = title; }

    @Override
    public String getCode() { return name(); };

    @Override
    public String getTitle() { return title; };
}
