package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/forgot-password")
@CrossOrigin(origins = "http://localhost:3000")
public class ForgotPasswordController {
    
    @Autowired
    private UserRepository userRepository;
    
    // Store reset tokens temporarily (in production, use Redis or database)
    private Map<String, String> resetTokens = new HashMap<>();
    
    @PostMapping("/send-reset-link")
    public ResponseEntity<?> sendResetLink(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            resetTokens.put(resetToken, email);
            
            // In production, send actual email here
            // For now, return the reset link
            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
            
            return ResponseEntity.ok(Map.of(
                "message", "Password reset link sent to your email",
                "resetLink", resetLink // Remove this in production
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        
        String email = resetTokens.get(token);
        if (email != null) {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                User userEntity = user.get();
                userEntity.setPassword(newPassword);
                userRepository.save(userEntity);
                
                // Remove used token
                resetTokens.remove(token);
                
                return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
            }
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token"));
    }
}