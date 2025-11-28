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
public interface CategoryService {

     List<Category> getAllCategories();


     Category getCategoryById(Long id);

}
