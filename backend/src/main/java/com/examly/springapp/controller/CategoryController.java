package com.examly.springapp.controller;

import com.examly.springapp.model.Category;
import com.examly.springapp.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addCategory(@RequestBody Category category) {
        Map<String, Object> response = new HashMap<>();
        
        if (categoryRepository.existsByName(category.getName())) {
            response.put("success", false);
            response.put("message", "Category already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        Category savedCategory = categoryRepository.save(category);
        response.put("success", true);
        response.put("category", savedCategory);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "Category not found");
        return ResponseEntity.notFound().build();
    }
}