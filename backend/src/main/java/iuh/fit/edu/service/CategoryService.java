package iuh.fit.edu.service;

import iuh.fit.edu.entity.Category;
import iuh.fit.edu.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return this.categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return this.categoryRepository.findById(id).orElse(null);
    }
}
