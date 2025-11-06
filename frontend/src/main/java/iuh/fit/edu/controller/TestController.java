/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller;

import iuh.fit.edu.service.TestService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Controller
public class TestController {
    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("/test")
    public String show(Model model) {
        model.addAttribute("items", testService.getOkData());
        return "show";
    }
    @GetMapping("/add")
    public String showAddForm() {
        return "add"; // add.jsp
    }

    @PostMapping("/add")
    public String submitAdd(@RequestParam("value") String value, Model model) {
        String result = testService.create(value);
        model.addAttribute("result", result);
        return "addResult"; // addResult.jsp
    }
}
