/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service;

import iuh.fit.edu.model.request.TestRequest;
import iuh.fit.edu.model.response.ApiResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Service
public class TestService {
    private final RestClient restClient;

    public TestService(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<String> getOkData() {
        ApiResponse<List<String>> res = restClient.get()
                .uri("/test/ok")
                .retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<String>>>() {});
        return res.getData();
    }
    public String create(String value) {
        TestRequest body = new TestRequest();
        body.setValue(value);

        ApiResponse<String> res = restClient.post()
                .uri("/test/add")
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<String>>() {});

        return res.getMessage();
    }
}
