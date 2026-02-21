package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.PrivacySettingRepository;
import com.examly.springapp.model.PrivacySetting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserPrivacyService {
    private static final Logger logger = LoggerFactory.getLogger(UserPrivacyService.class);

    @Autowired
    private UserRepository userRepository;

        @Autowired
        private PrivacySettingRepository privacySettingRepository;

    @Transactional
    public PrivacySetting updatePrivacySettings(Long userId, PrivacySetting updatedSettings) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Load or create privacy settings for user
        PrivacySetting settings = privacySettingRepository.findByUserId(userId).orElseGet(() -> {
            PrivacySetting ps = new PrivacySetting();
            ps.setUser(user);
            return ps;
        });

        // Log before update
        logger.info("Updating privacy settings for user: {}", user.getUsername());
        logger.info("Current settings - Profile Visibility: {}, Email Visible: {}, Phone Visible: {}, Interests Visible: {}, Social Links Visible: {}",
                settings.getProfileVisibility(),
                settings.getEmailVisibility(),
                settings.getPhoneVisibility(),
                settings.getInterestsVisibility(),
                settings.getSocialLinksVisibility());

        // Update privacy settings
        if (updatedSettings.getProfileVisibility() != null) settings.setProfileVisibility(updatedSettings.getProfileVisibility());
        if (updatedSettings.getEmailVisibility() != null) settings.setEmailVisibility(updatedSettings.getEmailVisibility());
        if (updatedSettings.getPhoneVisibility() != null) settings.setPhoneVisibility(updatedSettings.getPhoneVisibility());
        if (updatedSettings.getLocationVisibility() != null) settings.setLocationVisibility(updatedSettings.getLocationVisibility());
        if (updatedSettings.getInterestsVisibility() != null) settings.setInterestsVisibility(updatedSettings.getInterestsVisibility());
        if (updatedSettings.getSocialLinksVisibility() != null) settings.setSocialLinksVisibility(updatedSettings.getSocialLinksVisibility());

        // Save and log after update
        PrivacySetting saved = privacySettingRepository.save(settings);
        logger.info("Privacy settings updated successfully for user: {}", user.getUsername());
        logger.info("New settings - Profile Visibility: {}, Email Visible: {}, Phone Visible: {}, Interests Visible: {}, Social Links Visible: {}",
                saved.getProfileVisibility(),
                saved.getEmailVisibility(),
                saved.getPhoneVisibility(),
                saved.getInterestsVisibility(),
                saved.getSocialLinksVisibility());

        return saved;
    }

    public String getPrivacySettingsStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        PrivacySetting settings = privacySettingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Privacy settings not found for user: " + userId));

        return String.format("Privacy Settings for user %s:\n- Profile Visibility: %s\n- Email Visible: %s\n- Phone Visible: %s\n- Location Visible: %s\n- Interests Visible: %s\n- Social Links Visible: %s",
                user.getUsername(),
                settings.getProfileVisibility(),
                settings.getEmailVisibility(),
                settings.getPhoneVisibility(),
                settings.getLocationVisibility(),
                settings.getInterestsVisibility(),
                settings.getSocialLinksVisibility());
    }
}