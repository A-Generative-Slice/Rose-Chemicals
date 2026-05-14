'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X, ArrowLeft, Camera, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  bio?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
    promotionalEmails: boolean;
    newsletter: boolean;
  };
}

interface ProfileSettingsProps {
  onBack: () => void;
}

export default function ProfileSettingsSection({ onBack }: ProfileSettingsProps) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    avatar: '',
    bio: '',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      orderUpdates: true,
      promotionalEmails: false,
      newsletter: false
    }
  });

  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    avatar: '',
    bio: '',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      orderUpdates: true,
      promotionalEmails: false,
      newsletter: false
    }
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const initialData: UserProfile = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || undefined,
        avatar: user.avatar || '',
        bio: user.bio || '',
        preferences: user.preferences || {
          emailNotifications: true,
          smsNotifications: true,
          orderUpdates: true,
          promotionalEmails: false,
          newsletter: false
        }
      };
      
      setProfileData(initialData);
      setFormData(initialData);
      setLoading(false);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13 || age > 120) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const response = await authAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bio: formData.bio
      });

      if (response.user) {
        updateUser(response.user);
        setProfileData(formData);
        setEditingProfile(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = async () => {
    try {
      setSaving(true);
      const response = await authAPI.updatePreferences(formData.preferences);

      if (response.user) {
        updateUser(response.user);
        setProfileData(formData);
        setEditingPreferences(false);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setEditingProfile(false);
    setEditingPreferences(false);
    setFormErrors({});
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {!editingProfile ? (
            <button
              onClick={() => setEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-dark transition-colors"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleProfileSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-xl font-semibold">
                  {getInitials(profileData.name)}
                </div>
              )}
              {editingProfile && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Camera size={14} />
                </button>
              )}
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{profileData.name}</h4>
              <p className="text-gray-600">{profileData.email}</p>
              {profileData.bio && (
                <p className="text-sm text-gray-500 mt-1">{profileData.bio}</p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              {editingProfile ? (
                <>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-900 py-2">{profileData.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-900">{profileData.email}</p>
                <span className="text-xs text-gray-500">(Cannot be changed)</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {editingProfile ? (
                <>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      formErrors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-gray-900 py-2">{profileData.phone || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              {editingProfile ? (
                <>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      formErrors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.dateOfBirth && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.dateOfBirth}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-gray-900 py-2">{formatDate(profileData.dateOfBirth || '')}</p>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              {editingProfile ? (
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2">
                  {profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : 'Not set'}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {editingProfile ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
            ) : (
              <p className="text-gray-900 py-2">{profileData.bio || 'No bio added'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          {!editingPreferences ? (
            <button
              onClick={() => setEditingPreferences(true)}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-dark transition-colors"
            >
              <Edit2 size={16} />
              Edit Preferences
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handlePreferencesSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={editingPreferences ? formData.preferences.emailNotifications : profileData.preferences.emailNotifications}
              onChange={(e) => editingPreferences && setFormData({
                ...formData,
                preferences: { ...formData.preferences, emailNotifications: e.target.checked }
              })}
              disabled={!editingPreferences}
              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={editingPreferences ? formData.preferences.smsNotifications : profileData.preferences.smsNotifications}
              onChange={(e) => editingPreferences && setFormData({
                ...formData,
                preferences: { ...formData.preferences, smsNotifications: e.target.checked }
              })}
              disabled={!editingPreferences}
              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Order Updates */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">Order Updates</h4>
              <p className="text-sm text-gray-600">Get notified about order status changes</p>
            </div>
            <input
              type="checkbox"
              checked={editingPreferences ? formData.preferences.orderUpdates : profileData.preferences.orderUpdates}
              onChange={(e) => editingPreferences && setFormData({
                ...formData,
                preferences: { ...formData.preferences, orderUpdates: e.target.checked }
              })}
              disabled={!editingPreferences}
              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Promotional Emails */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">Promotional Emails</h4>
              <p className="text-sm text-gray-600">Receive offers and promotional content</p>
            </div>
            <input
              type="checkbox"
              checked={editingPreferences ? formData.preferences.promotionalEmails : profileData.preferences.promotionalEmails}
              onChange={(e) => editingPreferences && setFormData({
                ...formData,
                preferences: { ...formData.preferences, promotionalEmails: e.target.checked }
              })}
              disabled={!editingPreferences}
              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Newsletter */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Newsletter</h4>
              <p className="text-sm text-gray-600">Subscribe to our weekly newsletter</p>
            </div>
            <input
              type="checkbox"
              checked={editingPreferences ? formData.preferences.newsletter : profileData.preferences.newsletter}
              onChange={(e) => editingPreferences && setFormData({
                ...formData,
                preferences: { ...formData.preferences, newsletter: e.target.checked }
              })}
              disabled={!editingPreferences}
              className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Enable 2FA
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Login Sessions</h4>
              <p className="text-sm text-gray-600">Manage your active sessions</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
