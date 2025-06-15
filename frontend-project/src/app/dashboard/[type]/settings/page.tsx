'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      messages: true,
      updates: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    preferences: {
      theme: 'light',
      language: 'en'
    }
  });

  const handleToggle = (section: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: !prev[section][setting]
      }
    }));
  };

  const handleSelect = (section: string, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your preferences and privacy options</p>
      </div>

      <section className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
        <div className="grid gap-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div className="flex items-center justify-between" key={key}>
              <div>
                <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleToggle('notifications', key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Profile Visibility</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="connections">Connections Only</option>
          </select>
        </div>
        <div className="grid gap-4">
          {['showEmail', 'showPhone'].map(setting => (
            <div className="flex items-center justify-between" key={setting}>
              <span className="capitalize">{setting.replace('show', 'Show ')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy[setting]}
                  onChange={() => handleToggle('privacy', setting)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
        <div className="grid gap-4">
          <div>
            <label className="block font-medium mb-1">Language</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={settings.preferences.language}
              onChange={(e) => handleSelect('preferences', 'language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Theme</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={settings.preferences.theme}
              onChange={(e) => handleSelect('preferences', 'theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
      </div>
    </div>
  );
}
