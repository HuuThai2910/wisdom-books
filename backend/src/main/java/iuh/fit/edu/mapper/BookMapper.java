/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.summary.BookSummaryResponse;
import iuh.fit.edu.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Mapper(componentModel = "spring")
public interface BookMapper {
    @Mapping(target = "image", source = "image", qualifiedByName = "firstImage")
    @Mapping(target = "price", source = "sellingPrice")
    @Mapping(target = "quantity", source = "inventory.quantity")
    BookSummaryResponse toBookSummaryResponse(Book book);

    @Named("firstImage")
   default String mapFirstImage(List<String> images) {
        return (images != null && !images.isEmpty()) ? images.getFirst() : null;
    }
}
