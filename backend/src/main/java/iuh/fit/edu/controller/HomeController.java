/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller;

import iuh.fit.edu.utils.anotation.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@RestController
@RequestMapping("/test")
public class HomeController {
    @GetMapping("/ok")
    @ApiMessage("Lấy dữ liệu thành công")
    public ResponseEntity<List<String>> getOk() {
        return ResponseEntity.ok(List.of("A", "B", "C"));
    }
    @GetMapping("/delete")
    @ApiMessage("Xoá dữ liệu thành công")
    public ResponseEntity<Void> deleteSomething() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test-error")
    public String testError() {
        throw new RuntimeException("User not found");
    }
}
