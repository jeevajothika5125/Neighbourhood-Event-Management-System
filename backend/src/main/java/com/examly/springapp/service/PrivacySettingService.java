package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.model.PrivacySetting;
import com.examly.springapp.repository.PrivacySettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class PrivacySettingService {
    @Autowired
    private PrivacySettingRepository privacySettingRepository;

    @Transactional
    public PrivacySetting createPrivacySettings(User user) {
        PrivacySetting settings = new PrivacySetting();
        settings.setUser(user);
        return privacySettingRepository.save(settings);
    }

    public PrivacySetting getPrivacySettings(Long userId) {
        return privacySettingRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Privacy settings not found for user: " + userId));
    }

    @Transactional
    public PrivacySetting updatePrivacySettings(Long userId, PrivacySetting settingsUpdates) {
        PrivacySetting existingSettings = getPrivacySettings(userId);
        
        existingSettings.setProfileVisibility(settingsUpdates.getProfileVisibility());
        existingSettings.setEmailVisibility(settingsUpdates.getEmailVisibility());
        existingSettings.setPhoneVisibility(settingsUpdates.getPhoneVisibility());
        existingSettings.setLocationVisibility(settingsUpdates.getLocationVisibility());
        existingSettings.setInterestsVisibility(settingsUpdates.getInterestsVisibility());
        existingSettings.setSocialLinksVisibility(settingsUpdates.getSocialLinksVisibility());

        return privacySettingRepository.save(existingSettings);
    }
}