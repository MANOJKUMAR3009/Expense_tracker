package com.example.savemore.controller;


import com.example.savemore.model.Category;
import com.example.savemore.model.Transaction;
import com.example.savemore.model.User;
import com.example.savemore.model.enums.TransactionType;
import com.example.savemore.repository.CategoryRepository;
import com.example.savemore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private User getLoggedInUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ CREATE
    @PostMapping
    public Category createCategory(@RequestBody Category category,
                                   Authentication authentication) {

        User user = getLoggedInUser(authentication);
        category.setUser(user);

        return categoryRepository.save(category);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Category> getAllCategories(Authentication authentication) {

        User user = getLoggedInUser(authentication);
        return categoryRepository.findByUserId(user.getId());
    }

    // ✅ GET BY TYPE (Optional but powerful)
    @GetMapping("/type/{type}")
    public List<Category> getByType(@PathVariable TransactionType type,
                                    Authentication authentication) {

        User user = getLoggedInUser(authentication);
        return categoryRepository.findByUserAndType(user, type);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id,
                                   @RequestBody Category updatedCategory,
                                   Authentication authentication) {

        User user = getLoggedInUser(authentication);

        Category category = categoryRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(updatedCategory.getName());
        category.setType(updatedCategory.getType());

        return categoryRepository.save(category);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id,
                                 Authentication authentication) {

        User user = getLoggedInUser(authentication);

        Category category = categoryRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);

        return "Category deleted successfully";
    }
}