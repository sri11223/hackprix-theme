'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    // Check for stored credentials
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (attempts >= MAX_ATTEMPTS) {
      toast.error('Too many login attempts. Please try again later.');
      return;
    }

    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('Logging in...');

    try {
      const res = await fetch('https://hackprix-theme-v6r3.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setAttempts(prev => prev + 1);
        throw new Error(data.msg || 'Login failed');
      }

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }      // Store tokens and user info in cookies
      Cookies.set('token', data.token, { expires: 7 }); // Expires in 7 days
      Cookies.set('userType', data.userType, { expires: 7 });
      Cookies.set('userId', data.userId, { expires: 7 });
      Cookies.set('username', data.username, { expires: 7 });

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Login successful! Redirecting...');

      // Redirect based on user type
      setTimeout(() => {
        switch (data.userType) {
          case 'Startup':
            router.push('/dashboard/startup');
            break;
          case 'Investor':
            router.push('/dashboard/investor');
            break;
          default:
            router.push('/dashboard');
        }
      }, 1000);

    } catch (err: any) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-pink-100 to-purple-100">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                href="/forgot-password" 
                className="text-purple-600 hover:text-purple-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-purple-600 hover:text-purple-500"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}