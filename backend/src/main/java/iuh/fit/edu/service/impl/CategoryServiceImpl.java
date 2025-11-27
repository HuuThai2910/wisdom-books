package iuh.fit.edu.service.impl;

import iuh.fit.edu.entity.Category;
import iuh.fit.edu.repository.CategoryRepository;
import iuh.fit.edu.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @Override
    public List<Category> getAllCategories() {
        return this.categoryRepository.findAll();
    }
    @Override
    public Category getCategoryById(Long id) {
        return this.categoryRepository.findById(id).orElse(null);
    }
}
