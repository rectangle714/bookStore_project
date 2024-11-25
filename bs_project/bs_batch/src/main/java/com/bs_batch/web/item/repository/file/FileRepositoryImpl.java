package com.bs_batch.web.item.repository.file;

import com.bs_batch.web.item.repository.file.FileRepositoryCustom;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FileRepositoryImpl implements FileRepositoryCustom {
    private final JPAQueryFactory queryFactory;


}
