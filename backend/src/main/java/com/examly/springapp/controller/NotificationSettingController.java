package com.examly.springapp.controller;

import com.examly.springapp.model.NotificationSetting;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.NotificationSettingRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notification-settings")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationSettingController {

    @Autowired
    private NotificationSettingRepository notificationSettingRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<NotificationSetting> saveNotificationSettings(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            User user = userOpt.get();
            Optional<NotificationSetting> existingSettings = notificationSettingRepository.findByUserId(userId);
            
            NotificationSetting settings;
            if (existingSettings.isPresent()) {
                settings = existingSettings.get();
            } else {
                settings = new NotificationSetting();
                settings.setUser(user);
            }

            // Update all settings from request
            request.forEach((key, value) -> {
                if (!key.equals("userId") && value instanceof Boolean) {
                    updateSettingField(settings, key, (Boolean) value);
                }
            });

            NotificationSetting savedSettings = notificationSettingRepository.save(settings);
            return ResponseEntity.ok(savedSettings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<NotificationSetting> getNotificationSettings(@PathVariable Long userId) {
        Optional<NotificationSetting> settings = notificationSettingRepository.findByUserId(userId);
        return settings.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    private void updateSettingField(NotificationSetting settings, String fieldName, Boolean value) {
        switch (fieldName) {
            case "emailNotifications": settings.setEmailNotifications(value); break;
            case "pushNotifications": settings.setPushNotifications(value); break;
            case "eventReminders": settings.setEventReminders(value); break;
            case "eventUpdates": settings.setEventUpdates(value); break;
            case "registrationConfirmations": settings.setRegistrationConfirmations(value); break;
            case "marketingEmails": settings.setMarketingEmails(value); break;
            case "smsNotifications": settings.setSmsNotifications(value); break;
            case "weeklyDigest": settings.setWeeklyDigest(value); break;
        }
    }
}