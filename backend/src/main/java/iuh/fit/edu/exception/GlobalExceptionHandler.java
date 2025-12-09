/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.exception;

import iuh.fit.edu.dto.response.ApiResponse;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.stream.Collectors;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        // Kiểm tra nếu là lỗi ACCOUNT_DISABLED
        if (ex.getMessage() != null && ex.getMessage().startsWith("ACCOUNT_DISABLED:")) {
            LOGGER.warn("Account disabled: {}", ex.getMessage());
            String message = ex.getMessage().substring("ACCOUNT_DISABLED:".length()).trim();
            
            ApiResponse<Object> api = ApiResponse.error(
                    HttpStatus.FORBIDDEN.value(),
                    message,
                    "ACCOUNT_DISABLED"
            );
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(api);
        }
        
        // Kiểm tra nếu là lỗi FULLNAME_EXISTS
        if (ex.getMessage() != null && ex.getMessage().startsWith("FULLNAME_EXISTS:")) {
            LOGGER.warn("Fullname exists: {}", ex.getMessage());
            String message = ex.getMessage().substring("FULLNAME_EXISTS:".length()).trim();
            
            ApiResponse<Object> api = ApiResponse.error(
                    HttpStatus.BAD_REQUEST.value(),
                    message,
                    "FULLNAME_EXISTS"
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(api);
        }
        
        // Kiểm tra nếu là lỗi EMAIL_EXISTS
        if (ex.getMessage() != null && ex.getMessage().startsWith("EMAIL_EXISTS:")) {
            LOGGER.warn("Email exists: {}", ex.getMessage());
            String message = ex.getMessage().substring("EMAIL_EXISTS:".length()).trim();
            
            ApiResponse<Object> api = ApiResponse.error(
                    HttpStatus.BAD_REQUEST.value(),
                    message,
                    "EMAIL_EXISTS"
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(api);
        }
        
        // Xử lý RuntimeException khác
        LOGGER.error("RuntimeException caught in GlobalExceptionHandler", ex);
        ApiResponse<Object> api = ApiResponse.error(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(api);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {
        LOGGER.error("Unhandled exception caught in GlobalExceptionHandler", ex);
        ApiResponse<Object> api = ApiResponse.error(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(api);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        DefaultMessageSourceResolvable::getDefaultMessage
                ));

        ApiResponse<Object> api = ApiResponse.error(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(api);
    }

    @ExceptionHandler(value = {IdInvalidException.class})
    public ResponseEntity<ApiResponse<Object>> handleIdInvalidException(IdInvalidException ex) {
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        apiResponse.setMessage(ex.getMessage());
        apiResponse.setErrors("Invalid");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }
    //validate file upload
    @ExceptionHandler(value = {StorageException.class})
    public ResponseEntity<ApiResponse<Object>> handleFileUploadException(Exception ex) {
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        apiResponse.setMessage(ex.getMessage());
        apiResponse.setErrors("Exception upload file...");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }
}

