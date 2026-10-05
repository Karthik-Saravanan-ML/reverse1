package com.crm.common.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends AppException {
    public BusinessRuleException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
