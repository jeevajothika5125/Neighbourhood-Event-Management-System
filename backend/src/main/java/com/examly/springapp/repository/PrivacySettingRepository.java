package com.examly.springapp.repository;

import com.examly.springapp.model.PrivacySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PrivacySettingRepository extends JpaRepository<PrivacySetting, Long> {
    Optional<PrivacySetting> findByUserId(Long userId);
}