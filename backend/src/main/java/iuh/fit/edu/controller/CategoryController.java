package iuh.fit.edu.controller;

import iuh.fit.edu.entity.Category;
import iuh.fit.edu.service.impl.CategoryServiceImpl;
import iuh.fit.edu.util.anotation.ApiMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryServiceImpl categoryService;

    public CategoryController(CategoryServiceImpl categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @ApiMessage("Lấy tất cả danh mục")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.status(HttpStatus.OK).body(this.categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy danh mục theo id")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = this.categoryService.getCategoryById(id);
        return ResponseEntity.status(HttpStatus.OK).body(category);
    }
}
