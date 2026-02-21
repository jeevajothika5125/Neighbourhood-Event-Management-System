package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/db")
    public ResponseEntity<String> testDatabase() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok("Database connected. Users count: " + count);
        } catch (Exception e) {
            return ResponseEntity.ok("Database error: " + e.getMessage());
        }
    }

    @PostMapping("/user")
    public ResponseEntity<User> createTestUser() {
        try {
            User user = new User();
            user.setUsername("testuser");
            user.setEmail("test@example.com");
            user.setPassword("password");
            user.setRole(User.Role.PARTICIPANT);
            
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}