/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.entity.constant;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
public enum PaymentStatus {
    UNPAID {
        @Override
        public String toString() {
            return "Chưa thanh toán";
        }
    },
    PAID {
        @Override
        public String toString() {
            return "Đã thanh toán";
        }
    }
}
