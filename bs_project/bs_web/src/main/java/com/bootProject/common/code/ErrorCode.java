package com.bootProject.common.code;

public enum ErrorCode {
    
    /* 공통 에러 */
    INVALID_INPUT_VALUE(400, "COMMON-001", "유효성 검증에 실패한 경우"),
    INVALID_URL(401, "COMMON-002", "잘못된 URL인 경우"),
    INTERNAL_SERVER_ERROR(500, "COMMON-002", "서버에서 처리할 수 없는 경우"),
    FILE_DELETE_ERROR(501, "COMMON-003", "파일 삭제 실패한 경우"),

    /* 계정 관련 에러 */
    DUPLICATE_LOGIN_ID(400, "ACCOUNT-001", "계정명이 중복된 경우"),
    UNAUTHORIZED(401, "ACCOUNT-002", "인증에 실패한 경우"),
    ROLE_NOT_EXISTS(403, "ACCOUNT-004", "권한이 부족한 경우"),
    ACCOUNT_NOT_FOUND(404, "ACCOUNT-003", "계정을 찾을 수 없는 경우"),

    /* JWT 에러 */
    TOKEN_NOT_EXISTS(404, "TOKEN-001", "해당 key의 인증 토큰이 존재하지 않는 경우"),
    EXPIRED_TOKEN(401, "TOKEN-002", "토큰 시간이 만료된 경우"),
    WRONG_TYPE_TOKEN(401, "TOKEN-003", "잘못된 토큰인 경우");




    private final int status;
    private final String code;
    private final String description;

    ErrorCode(int status, String code, String description) {
        this.status = status;
        this.code = code;
        this.description = description;
    }

    public int getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
