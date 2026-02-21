import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Neighbourhood Event Management System',
    maxEventsPerOrganizer: 10,
    autoApproveEvents: false,
    allowRegistrations: true,
    maintenanceMode: false,
    emailNotifications: true,
    maxFileSize: 5,
    eventCategories: []
  });

  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load categories from database
      const categories = await categoryService.getAllCategories();
      const categoryNames = categories.map(cat => cat.name);
      
      // Load other settings from localStorage
      const savedSettings = localStorage.getItem('systemSettings');
      const localSettings = savedSettings ? JSON.parse(savedSettings) : {};
      
      setSettings(prev => ({ 
        ...prev, 
        ...localSettings,
        eventCategories: categoryNames
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addCategory = async () => {
    if (newCategory.trim() && !settings.eventCategories.includes(newCategory.trim())) {
      try {
        await categoryService.addCategory(newCategory.trim());
        setSettings(prev => ({
          ...prev,
          eventCategories: [...prev.eventCategories, newCategory.trim()]
        }));
        setNewCategory('');
        alert('Category added successfully!');
      } catch (error) {
        alert('Failed to add category. It may already exist.');
      }
    }
  };

  const removeCategory = async (category) => {
    if (settings.eventCategories.length <= 3) {
      alert('Minimum 3 categories required. Cannot remove more categories.');
      return;
    }
    
    try {
      // Find category in database and delete
      const categories = await categoryService.getAllCategories();
      const categoryToDelete = categories.find(cat => cat.name === category);
      
      if (categoryToDelete) {
        await categoryService.deleteCategory(categoryToDelete.id);
      }
      
      setSettings(prev => ({
        ...prev,
        eventCategories: prev.eventCategories.filter(cat => cat !== category)
      }));
      alert('Category removed successfully!');
    } catch (error) {
      alert('Failed to remove category.');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        siteName: 'Neighbourhood Event Management System',
        maxEventsPerOrganizer: 10,
        autoApproveEvents: false,
        allowRegistrations: true,
        maintenanceMode: false,
        emailNotifications: true,
        maxFileSize: 5,
        eventCategories: ['Community', 'Sports', 'Music', 'Food', 'Art', 'Education']
      });
    }
  };

  return (
    <div className="system-settings">
      <div className="settings-header">
        <h2>⚙️ System Settings</h2>
        <p>Configure system-wide settings and preferences</p>
      </div>

      <div className="settings-grid">


        <div className="settings-card">
          <h3>Event Management</h3>
          <div className="setting-item">
            <label className="setting-label">Auto-approve Events</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="autoApproveEvents"
                  checked={settings.autoApproveEvents === true}
                  onChange={() => handleInputChange('autoApproveEvents', true)}
                  className="radio-input"
                />
                Allow
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="autoApproveEvents"
                  checked={settings.autoApproveEvents === false}
                  onChange={() => handleInputChange('autoApproveEvents', false)}
                  className="radio-input"
                />
                Deny
              </label>
            </div>
            <p className="setting-description">Automatically approve new events without admin review</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">Allow Event Registrations</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="allowRegistrations"
                  checked={settings.allowRegistrations === true}
                  onChange={() => handleInputChange('allowRegistrations', true)}
                  className="radio-input"
                />
                Allow
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="allowRegistrations"
                  checked={settings.allowRegistrations === false}
                  onChange={() => handleInputChange('allowRegistrations', false)}
                  className="radio-input"
                />
                Deny
              </label>
            </div>
            <p className="setting-description">Enable users to register for events</p>
          </div>
        </div>

        <div className="settings-card">
          <h3>System Control</h3>
          <div className="setting-item">
            <label className="setting-label">Maintenance Mode</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode === true}
                  onChange={() => handleInputChange('maintenanceMode', true)}
                  className="radio-input"
                />
                Allow
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode === false}
                  onChange={() => handleInputChange('maintenanceMode', false)}
                  className="radio-input"
                />
                Deny
              </label>
            </div>
            <p className="setting-description">Put the system in maintenance mode</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">Email Notifications</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="emailNotifications"
                  checked={settings.emailNotifications === true}
                  onChange={() => handleInputChange('emailNotifications', true)}
                  className="radio-input"
                />
                Allow
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="emailNotifications"
                  checked={settings.emailNotifications === false}
                  onChange={() => handleInputChange('emailNotifications', false)}
                  className="radio-input"
                />
                Deny
              </label>
            </div>
            <p className="setting-description">Send email notifications to users</p>
          </div>
        </div>

        <div className="settings-card">
          <h3>Event Categories</h3>
          <div className="categories-list">
            {settings.eventCategories.map(category => (
              <div key={category} className="category-item">
                <span>{category}</span>
                <button
                  onClick={() => removeCategory(category)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-category">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="category-input"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory} className="add-btn">Add</button>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button onClick={resetToDefaults} className="btn btn-warning">
          Reset to Defaults
        </button>
        <button onClick={saveSettings} className="btn btn-primary">
          Save Settings
        </button>
      </div>

      <div className="back-button">
        <a href="/admin-dashboard" className="btn btn-secondary">← Back to Dashboard</a>
      </div>

      <style jsx>{`
        .system-settings {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .settings-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .settings-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .settings-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .settings-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .setting-item {
          margin-bottom: 1.5rem;
        }

        .setting-item label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #fce7f3;
        }

        .setting-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
        }

        .setting-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .setting-input:focus {
          outline: none;
          border-color: rgba(236,72,153,0.6);
          box-shadow: 0 0 0 3px rgba(236,72,153,0.2);
        }

        .setting-label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #fce7f3;
          font-size: 1.1rem;
        }

        .radio-group {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          color: #fce7f3;
        }

        .radio-input {
          width: 20px;
          height: 20px;
          margin: 0;
        }

        .radio-custom {
          display: none;
        }

        .setting-description {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }

        .categories-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .remove-btn {
          background: rgba(239,68,68,0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-category {
          display: flex;
          gap: 0.5rem;
        }

        .category-input {
          flex: 1;
          padding: 0.5rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .add-btn {
          background: linear-gradient(45deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .settings-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .back-button {
          text-align: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          box-shadow: 0 8px 20px rgba(236,72,153,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(236,72,153,0.4);
        }

        .btn-warning {
          background: linear-gradient(45deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 8px 20px rgba(245,158,11,0.3);
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(245,158,11,0.4);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .system-settings {
            padding: 1rem;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SystemSettings;