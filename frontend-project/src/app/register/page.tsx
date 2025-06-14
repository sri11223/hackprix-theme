'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import styled from 'styled-components';

// MultiStepLoader component inlined here
function MultiStepLoader({ steps, activeStep, visible }: { steps: string[]; activeStep: number; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 min-w-[320px] flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <div className="flex flex-col items-center w-full">
          {steps.map((step, idx) => (
            <div key={step} className={`flex items-center w-full mb-2 last:mb-0`}>
              <div className={`h-3 w-3 rounded-full mr-3 ${idx < activeStep ? 'bg-green-400' : idx === activeStep ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${idx === activeStep ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-indigo-700 font-semibold text-lg">{steps[activeStep] || 'Loading...'}</div>
      </div>
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',

  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);

  const loaderSteps = [
    'Validating',
    'Creating Account',
    'Sending Welcome Email',
    'Finishing Up'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowLoader(true);
    setLoaderStep(0);

    const loadingToast = toast.loading('Creating your account...');

    try {
      setLoaderStep(1); // Step 1: Sending data
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setLoaderStep(2); // Step 2: Waiting for response
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed. Please try again.');
      }

      setLoaderStep(3); // Step 3: Processing success
      Cookies.set('token', data.token, { expires: 1/24 });
      if (data.userType) Cookies.set('userType', data.userType);
      Cookies.set('userId', data.userId);

      toast.dismiss(loadingToast);
      toast.success('Account created successfully!');

      setTimeout(() => {
        setShowLoader(false);
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message);
      setError(err.message);
      setShowLoader(false);
    } finally {
      setLoading(false);
    }
  };

  const renderExtraFields = () => null;

  return (
    <StyledWrapper>
      <MultiStepLoader steps={loaderSteps} activeStep={loaderStep} visible={showLoader} />
      <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        {/* Left Side - Branding/Content */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 p-12 text-white items-center justify-center">
          <div className="max-w-md mx-auto flex flex-col justify-center">
            <div className="mb-8">
              <Image 
                src="/logo-white.png" 
                alt="Startup Success Platform" 
                width={180}
                height={60}
                className="mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">Join the Future of Startups</h1>
              <p className="text-lg opacity-90 mb-8">
                Connect with founders, investors, and talent in the world's first AI-powered startup ecosystem.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI-Powered Matching</h3>
                  <p className="opacity-90">Find the perfect co-founders, investors, and team members with our smart algorithms.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Success Predictor</h3>
                  <p className="opacity-90">Get real-time insights about your startup's potential and risks.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Live Pitch Arena</h3>
                  <p className="opacity-90">Showcase your startup to investors with real-time feedback and AI analysis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="form">
            <p className="title">Register</p>
            <p className="message">Signup now and get full access to our app.</p>
            <div className="flex">
              <label>
                <input
                  required
                  placeholder=" "
                  type="text"
                  name="firstName"
                  className="input"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <span>Firstname</span>
              </label>
              <label>
                <input
                  required
                  placeholder=" "
                  type="text"
                  name="lastName"
                  className="input"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <span>Lastname</span>
              </label>
            </div>
            <label>
              <input
                required
                placeholder=" "
                type="text"
                name="username"
                className="input"
                value={formData.username}
                onChange={handleChange}
              />
              <span>Username</span>
            </label>
            <label>
              <input
                required
                placeholder=" "
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
              <span>Email</span>
            </label>
            <label>
              <input
                required
                placeholder=" "
                type="tel"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
              />
              <span>Phone</span>
            </label>
            <label>
              <input
                required
                placeholder=" "
                type="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
              />
              <span>Password</span>
            </label>
            <button className="submit" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Submit'}
            </button>
            <p className="signin">
              Already have an account?{' '}
              <a href="#" onClick={e => { e.preventDefault(); router.push('/login'); }}>Signin</a>
            </p>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    background-color: #fff;
    padding: 30px;
    border-radius: 20px;
    position: relative;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }
  .title {
    font-size: 28px;
    color: royalblue;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .title::before,.title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: royalblue;
  }
  .title::before {
    width: 18px;
    height: 18px;
    background-color: royalblue;
  }
  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }
  .message, .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }
  .signin {
    text-align: center;
  }
  .signin a {
    color: royalblue;
    cursor: pointer;
  }
  .signin a:hover {
    text-decoration: underline royalblue;
  }
  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }
  .form label {
    position: relative;
  }
  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    background: #f9f9f9;
  }
  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
    background: #fff;
    padding: 0 5px;
  }
  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }
  .form label .input:focus + span,.form label .input:valid + span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
  }
  .form label .input:valid + span {
    color: green;
  }
  .submit {
    border: none;
    outline: none;
    background-color: royalblue;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    margin-top: 10px;
  }
  .submit:hover {
    background-color: rgb(56, 90, 194);
  }
  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }
    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;