package iuh.fit.edu.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/24/2025 2:46 PM
 */
@Setter
@Getter
public class ResultPaginationDTO {
    private Meta meta;
    private Object result;

    @Setter
    @Getter
    public static class Meta {
        private int page;
        private int pageSize;
        private int pages;
        private long total;
    }
}
