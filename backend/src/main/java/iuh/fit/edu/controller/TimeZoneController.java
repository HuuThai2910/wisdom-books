/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/api")
public class TimeZoneController {
    @GetMapping("/tz")
    public String tz() {
        return "JVM TZ = " + ZoneId.systemDefault() +
                " | Time now: " + LocalDateTime.now();
    }
}
