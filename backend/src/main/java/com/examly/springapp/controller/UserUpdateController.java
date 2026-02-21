package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserUpdateController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            if (userRepository.existsByUsername(user.getUsername())) {
                return ResponseEntity.ok().build();
            }
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.ok().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User userUpdates) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (userUpdates.getUsername() != null) {
                user.setUsername(userUpdates.getUsername());
            }
            if (userUpdates.getEmail() != null) {
                user.setEmail(userUpdates.getEmail());
            }
            
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/username/{username}")
    @Transactional
    public ResponseEntity<User> updateUserByUsername(@PathVariable String username, @RequestBody User userUpdates) {
        try {
            System.out.println("Updating user: " + username);
            System.out.println("Update data: " + userUpdates.getUsername() + ", " + userUpdates.getEmail());
            
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (!userOptional.isPresent()) {
                // Create new user if not exists
                User newUser = new User();
                newUser.setUsername(userUpdates.getUsername() != null ? userUpdates.getUsername() : username);
                newUser.setEmail(userUpdates.getEmail() != null ? userUpdates.getEmail() : "default@email.com");
                newUser.setPassword("password123"); // Default password
                newUser.setRole(User.Role.PARTICIPANT); // Default role
                
                User savedUser = userRepository.save(newUser);
                System.out.println("Created new user with ID: " + savedUser.getId());
                return ResponseEntity.ok(savedUser);
            }
            
            User user = userOptional.get();
            System.out.println("Found existing user with ID: " + user.getId());
            
            if (userUpdates.getUsername() != null && !userUpdates.getUsername().trim().isEmpty()) {
                user.setUsername(userUpdates.getUsername());
            }
            if (userUpdates.getEmail() != null && !userUpdates.getEmail().trim().isEmpty()) {
                user.setEmail(userUpdates.getEmail());
            }
            
            User savedUser = userRepository.save(user);
            System.out.println("Updated user successfully: " + savedUser.getUsername());
            return ResponseEntity.ok(savedUser);
            
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}