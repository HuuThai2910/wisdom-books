/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.utils;

import iuh.fit.edu.dto.reponse.ApiResponse;
import iuh.fit.edu.utils.anotation.ApiMessage;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@RestControllerAdvice
public class FormatApiResponse implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        ApiMessage apiMessage = returnType.getMethodAnnotation(ApiMessage.class);
        String message = apiMessage != null ? apiMessage.value() : "CALL API SUCCESS";

        if (body instanceof ApiResponse || body instanceof String || body instanceof Resource) {
            return body;
        }
        if (status >= 400) {
            return body;
        }
        return ApiResponse.success(status, message, body);
    }
}
