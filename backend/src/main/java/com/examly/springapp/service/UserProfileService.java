package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserProfile;
import com.examly.springapp.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfile createProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        return userProfileRepository.save(profile);
    }

    public UserProfile getProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));
    }

    @Transactional
    public UserProfile updateProfile(Long userId, UserProfile profileUpdates) {
        UserProfile existingProfile = getProfile(userId);
        
        if (profileUpdates.getBio() != null) 
            existingProfile.setBio(profileUpdates.getBio());
        if (profileUpdates.getLocation() != null) 
            existingProfile.setLocation(profileUpdates.getLocation());
        if (profileUpdates.getPhoneNumber() != null) 
            existingProfile.setPhoneNumber(profileUpdates.getPhoneNumber());
        if (profileUpdates.getInterests() != null) 
            existingProfile.setInterests(profileUpdates.getInterests());
        if (profileUpdates.getWebsite() != null) 
            existingProfile.setWebsite(profileUpdates.getWebsite());
        if (profileUpdates.getSocialLinks() != null) 
            existingProfile.setSocialLinks(profileUpdates.getSocialLinks());
        if (profileUpdates.getProfileImage() != null) 
            existingProfile.setProfileImage(profileUpdates.getProfileImage());

        return userProfileRepository.save(existingProfile);
    }
}