package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserProfile;
import com.examly.springapp.model.PrivacySetting;
import com.examly.springapp.model.NotificationSetting;
import com.examly.springapp.repository.NotificationSettingRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.UserProfileService;
import com.examly.springapp.service.PrivacySettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private PrivacySettingService privacySettingService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        UserProfile profile = userProfileService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody User userUpdates) {
        try {
            System.out.println("Updating profile for user ID: " + userId);
            System.out.println("Update data: " + userUpdates.getUsername() + ", " + userUpdates.getEmail());
            
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                // Create user if not exists
                user = new User();
                user.setUsername(userUpdates.getUsername());
                user.setEmail(userUpdates.getEmail());
                user.setPassword("password");
                user.setRole(User.Role.PARTICIPANT);
                System.out.println("Creating new user");
            } else {
                if (userUpdates.getUsername() != null) {
                    user.setUsername(userUpdates.getUsername());
                }
                if (userUpdates.getEmail() != null) {
                    user.setEmail(userUpdates.getEmail());
                }
                System.out.println("Updating existing user");
            }
            
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update user profile: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfile> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile profileUpdates) {
        UserProfile updatedProfile = userProfileService.updateProfile(userId, profileUpdates);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/{userId}/privacy")
    public ResponseEntity<PrivacySetting> getPrivacySettings(@PathVariable Long userId) {
        PrivacySetting settings = privacySettingService.getPrivacySettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/{userId}/privacy")
    public ResponseEntity<PrivacySetting> updatePrivacySettings(
            @PathVariable Long userId,
            @RequestBody PrivacySetting settingsUpdates) {
        PrivacySetting updatedSettings = privacySettingService.updatePrivacySettings(userId, settingsUpdates);
        return ResponseEntity.ok(updatedSettings);
    }

    @Autowired
    private NotificationSettingRepository notificationSettingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Profile controller is working!");
    }

    @GetMapping("/{userId}/notifications")
    public ResponseEntity<NotificationSetting> getNotificationSettings(@PathVariable Long userId) {
        NotificationSetting existing = notificationSettingRepository.findByUserId(userId)
                .orElse(null);
        
        if (existing == null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                existing = new NotificationSetting();
                existing.setUser(user);
                existing = notificationSettingRepository.save(existing);
            }
        }
        
        return ResponseEntity.ok(existing);
    }

    @PostMapping("/{userId}/notifications")
    public ResponseEntity<Map<String, Object>> saveNotificationSettings(
            @PathVariable Long userId,
            @RequestBody NotificationSetting settings) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Saving notification settings for user ID: " + userId);
            
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                // Create a test user if not exists
                user = new User();
                user.setUsername("testuser" + userId);
                user.setEmail("test" + userId + "@example.com");
                user.setPassword("password");
                user.setRole(User.Role.PARTICIPANT);
                user = userRepository.save(user);
                System.out.println("Created test user with ID: " + user.getId());
            }
            
            NotificationSetting existing = notificationSettingRepository.findByUserId(userId)
                    .orElse(new NotificationSetting());
            
            existing.setUser(user);
            if (settings.getEmailNotifications() != null) existing.setEmailNotifications(settings.getEmailNotifications());
            if (settings.getPushNotifications() != null) existing.setPushNotifications(settings.getPushNotifications());
            if (settings.getEventReminders() != null) existing.setEventReminders(settings.getEventReminders());
            if (settings.getEventUpdates() != null) existing.setEventUpdates(settings.getEventUpdates());
            if (settings.getRegistrationConfirmations() != null) existing.setRegistrationConfirmations(settings.getRegistrationConfirmations());
            if (settings.getMarketingEmails() != null) existing.setMarketingEmails(settings.getMarketingEmails());
            if (settings.getSmsNotifications() != null) existing.setSmsNotifications(settings.getSmsNotifications());
            if (settings.getWeeklyDigest() != null) existing.setWeeklyDigest(settings.getWeeklyDigest());
            
            NotificationSetting saved = notificationSettingRepository.save(existing);
            System.out.println("Settings saved successfully with ID: " + saved.getId());
            
            response.put("success", true);
            response.put("message", "Notification settings saved successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error saving notification settings: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to save settings: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}