-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    profile_image VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    phone_number VARCHAR(20),
    interests TEXT,
    website VARCHAR(255),
    social_links JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create privacy settings table
CREATE TABLE IF NOT EXISTS user_privacy_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    profile_visibility VARCHAR(10) DEFAULT 'public',
    email_visible BOOLEAN DEFAULT false,
    phone_visible BOOLEAN DEFAULT false,
    data_sharing BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create settings history log table
CREATE TABLE IF NOT EXISTS privacy_settings_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create trigger for logging privacy setting changes
DELIMITER //
CREATE TRIGGER log_privacy_settings_changes
AFTER UPDATE ON user_privacy_settings
FOR EACH ROW
BEGIN
    IF OLD.profile_visibility != NEW.profile_visibility THEN
        INSERT INTO privacy_settings_history (user_id, field_name, old_value, new_value)
        VALUES (NEW.user_id, 'profile_visibility', OLD.profile_visibility, NEW.profile_visibility);
    END IF;

    IF OLD.email_visible != NEW.email_visible THEN
        INSERT INTO privacy_settings_history (user_id, field_name, old_value, new_value)
        VALUES (NEW.user_id, 'email_visible', OLD.email_visible, NEW.email_visible);
    END IF;

    IF OLD.phone_visible != NEW.phone_visible THEN
        INSERT INTO privacy_settings_history (user_id, field_name, old_value, new_value)
        VALUES (NEW.user_id, 'phone_visible', OLD.phone_visible, NEW.phone_visible);
    END IF;

    IF OLD.data_sharing != NEW.data_sharing THEN
        INSERT INTO privacy_settings_history (user_id, field_name, old_value, new_value)
        VALUES (NEW.user_id, 'data_sharing', OLD.data_sharing, NEW.data_sharing);
    END IF;

    IF OLD.marketing_emails != NEW.marketing_emails THEN
        INSERT INTO privacy_settings_history (user_id, field_name, old_value, new_value)
        VALUES (NEW.user_id, 'marketing_emails', OLD.marketing_emails, NEW.marketing_emails);
    END IF;
END//
DELIMITER ;

-- Create view for easy querying of user profiles with privacy settings
CREATE OR REPLACE VIEW user_profiles_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    up.*,
    ups.profile_visibility,
    ups.email_visible,
    ups.phone_visible,
    ups.data_sharing,
    ups.marketing_emails
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_privacy_settings ups ON u.id = ups.user_id;

-- Insert default privacy settings for existing users
INSERT INTO user_privacy_settings (user_id, profile_visibility, email_visible, phone_visible, data_sharing, marketing_emails)
SELECT id, 'public', false, false, false, true
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM user_privacy_settings ups WHERE ups.user_id = u.id
);

-- Insert default profiles for existing users
INSERT INTO user_profiles (user_id, bio)
SELECT id, 'No bio yet'
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.user_id = u.id
);