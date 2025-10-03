'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  profilePicture?: string;
  bio?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch('https://hackprix-theme-v6r3.vercel.app/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setProfile(data.data);
        setFormData(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const token = Cookies.get('token');
      const res = await fetch('https://hackprix-theme-v6r3.vercel.app/api/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      setProfile(data.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData?.firstName || ''}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData?.lastName || ''}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData?.bio || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setEditing(false);
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{profile?.firstName} {profile?.lastName}</h2>
                    <p className="text-gray-600">{profile?.userType}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Email</h3>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Phone</h3>
                <p className="text-gray-600">{profile?.phone}</p>
              </div>
            </div>

            {profile?.bio && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Bio</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
