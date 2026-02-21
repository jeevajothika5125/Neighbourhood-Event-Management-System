-- Add privacy settings columns to users table if they don't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS privacy_profile_visibility VARCHAR(10) DEFAULT 'public',
ADD COLUMN IF NOT EXISTS privacy_email_visible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_phone_visible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_data_sharing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_marketing_emails BOOLEAN DEFAULT true;

-- Create a trigger to log privacy setting changes
CREATE TABLE IF NOT EXISTS privacy_settings_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER IF NOT EXISTS log_privacy_changes
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.privacy_profile_visibility != NEW.privacy_profile_visibility THEN
        INSERT INTO privacy_settings_log (user_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'profile_visibility', OLD.privacy_profile_visibility, NEW.privacy_profile_visibility);
    END IF;

    IF OLD.privacy_email_visible != NEW.privacy_email_visible THEN
        INSERT INTO privacy_settings_log (user_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'email_visible', OLD.privacy_email_visible, NEW.privacy_email_visible);
    END IF;

    IF OLD.privacy_phone_visible != NEW.privacy_phone_visible THEN
        INSERT INTO privacy_settings_log (user_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'phone_visible', OLD.privacy_phone_visible, NEW.privacy_phone_visible);
    END IF;

    IF OLD.privacy_data_sharing != NEW.privacy_data_sharing THEN
        INSERT INTO privacy_settings_log (user_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'data_sharing', OLD.privacy_data_sharing, NEW.privacy_data_sharing);
    END IF;

    IF OLD.privacy_marketing_emails != NEW.privacy_marketing_emails THEN
        INSERT INTO privacy_settings_log (user_id, field_name, old_value, new_value)
        VALUES (NEW.id, 'marketing_emails', OLD.privacy_marketing_emails, NEW.privacy_marketing_emails);
    END IF;
END//
DELIMITER ;

-- Create a view to easily check recent privacy changes
CREATE OR REPLACE VIEW recent_privacy_changes AS
SELECT 
    u.username,
    l.field_name,
    l.old_value,
    l.new_value,
    l.changed_at
FROM privacy_settings_log l
JOIN users u ON u.id = l.user_id
ORDER BY l.changed_at DESC
LIMIT 100;