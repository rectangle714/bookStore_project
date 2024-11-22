package com.bs_web.web.item.repository.file;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FileRepositoryImpl implements FileRepositoryCustom {
    private final JPAQueryFactory queryFactory;


}
