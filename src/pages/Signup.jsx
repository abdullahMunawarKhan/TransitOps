
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Truck, ShieldAlert, Zap, TrendingUp } from 'lucide-react';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getUsersFromStorage = () => {
    const storedUsers = localStorage.getItem('transitops.users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  const saveUserToStorage = (user) => {
    const storedUsers = getUsersFromStorage();
    storedUsers.push(user);
    localStorage.setItem('transitops.users', JSON.stringify(storedUsers));
  };

  const handleSignup = async () => {
    setMessage({ text: '', type: '' });

    if (!name || !email || !role || !password || !confirmPassword) {
      return setMessage({ text: 'All fields are required.', type: 'error' });
    }

    if (!isValidEmail(email)) {
      return setMessage({ text: 'Invalid email format.', type: 'error' });
    }

    if (password.length < 6) {
      return setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
    }

    if (password !== confirmPassword) {
      return setMessage({ text: 'Passwords do not match.', type: 'error' });
    }

    // Check if email already exists
    const storedUsers = getUsersFromStorage();
    const emailExists = storedUsers.some(u => u.email === email);
    if (emailExists) {
      return setMessage({ text: 'Email already registered.', type: 'error' });
    }

    setIsLoading(true);
    
    // Save new user to localStorage
    const newUser = {
      name,
      email,
      role,
      password
    };
    saveUserToStorage(newUser);

    setMessage({ 
      text: '✅ Account created! Redirecting to login...', 
      type: 'success' 
    });
    setTimeout(() => navigate('/login'), 2000);

    setIsLoading(false);
  };

  const features = [
    { icon: Zap, title: 'Real-time Updates', desc: 'Live fleet status and trip tracking' },
    { icon: ShieldAlert, title: 'Secure Access', desc: 'Role-based permissions and authentication' },
    { icon: TrendingUp, title: 'Powerful Analytics', desc: 'Comprehensive reports and insights' }
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#2563EB] transition mb-4"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            
            <h1 className="text-xl font-bold text-[#111827] mb-1.5">
              Create Account
            </h1>
            <p className="text-sm text-[#6B7280]">
              Join TransitOps and start managing your fleet
            </p>
          </div>

          {/* Signup Form */}
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-3.5">
              {/* Message */}
              {message.text && (
                <div
                  className={`px-3 py-2.5 rounded-lg text-xs flex flex-col gap-1.5 ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{message.text}</span>
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-[#374151] mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1.5 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-[#374151] mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1.5 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-xs font-medium text-[#374151] mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1.5 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select your role</option>
                  <option value="fleet">Fleet Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="safety_officer">Safety Officer</option>
                  <option value="financial_analyst">Financial Analyst</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-[#374151] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="w-full px-3 py-2.5 pr-9 rounded-lg bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1.5 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#6B7280] mt-1.5">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#374151] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-2.5 pr-9 rounded-lg bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1.5 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-[1.01] transition-all duration-200 shadow-sm hover:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In */}
            <div className="text-center pt-3">
              <p className="text-xs text-[#6B7280]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#2563EB] hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white p-8 flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Truck className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold">TransitOps</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2.5">
              Start Managing Your Fleet Today
            </h3>
            <p className="text-blue-100 text-sm">
              Get access to all the tools you need to streamline your operations and improve efficiency.
            </p>
          </div>

          <div className="space-y-2.5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-blue-100 text-xs">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-blue-200">
          © 2026 TransitOps. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Signup;

