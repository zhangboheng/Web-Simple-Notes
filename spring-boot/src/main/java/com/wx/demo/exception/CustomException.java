package com.wx.demo.exception;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustomException extends RuntimeException {
    private Integer code;
    private String message;

    public CustomException(Integer code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

