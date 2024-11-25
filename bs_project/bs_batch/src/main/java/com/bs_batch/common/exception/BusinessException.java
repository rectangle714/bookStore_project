package com.bs_batch.common.exception;

import com.bs_batch.common.code.ErrorCode;

public class BusinessException extends Exception {
    private ErrorCode errorCode;
    private String message;

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
