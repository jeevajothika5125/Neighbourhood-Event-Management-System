package com.examly.springapp.service;

import com.examly.springapp.model.AuditLog;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    
    public void logAction(String action, String entityType, Long entityId, String userId) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setUserId(userId);
        log.setTimestamp(java.time.LocalDateTime.now().toString());
        // Save to database logic would go here
        System.out.println("Audit log: " + action + " on " + entityType + " by " + userId);
    }
}