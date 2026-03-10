package com.example.savemore.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class ApiError {

    private int status;
    private String message;
    private LocalDateTime timestamp;
}