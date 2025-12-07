/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service;/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */

import iuh.fit.edu.entity.Order;
import org.springframework.scheduling.annotation.Async;

public interface EmailService {
    void sendEmailSync(String to, String subject, String content, boolean isMultipart, boolean isHtml);

    @Async
    void sendEmailFromTemplateSync(String to, String subject,
                                   String templateName, Order order);
}
