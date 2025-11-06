/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Configuration
public class RestClientConfig {

    @Value("${backend.api.url}")
    private String backendUrl;

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(backendUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
