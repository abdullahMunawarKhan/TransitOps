
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Truck, ShieldAlert, Zap, TrendingUp } from 'lucide-react';

// Static credentials
const staticUsers = [
  { email: 'dispatcher@gmail.com', password: 'password', role: 'dispatcher', name: 'Dispatcher' },
  { email: 'admin@gmail.com', password: 'password', role: 'admin', name: 'Admin' },
  { email: 'fleet@gmail.com', password: 'password', role: 'fleet', name: 'Fleet Manager' }
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const navigate = useNavigate();

  const getUsersFromStorage = () => {
    const storedUsers = localStorage.getItem('transitops.users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  const handleLogin = async () => {
    setErrorEmail('');
    setErrorPassword('');
    setLoginError('');
    setIsLoading(true);

    if (!email) {
      setErrorEmail('Email is required.');
      setIsLoading(false);
      return;
    } else if (!isValidEmail(email)) {
      setErrorEmail('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorPassword('Password is required.');
      setIsLoading(false);
      return;
    }

    // Get all users (static + stored)
    const storedUsers = getUsersFromStorage();
    const allUsers = [...staticUsers, ...storedUsers];

    // Check if user exists and password matches
    const user = allUsers.find(u => u.email === email && u.password === password);

    if (user) {
      // Store session
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          access_token: 'mock-token',
          user: { email: user.email, role: user.role, name: user.name }
        }
      }));
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'fleet') {
          navigate('/fleet-dashboard');
        } else if (user.role === 'dispatcher') {
          navigate('/dispatcher-dashboard');
        } else if (user.role === 'safety_officer') {
          navigate('/safety-dashboard');
        } else if (user.role === 'financial_analyst') {
          navigate('/finance-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } else {
      setLoginError('Invalid email or password.');
    }

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
              Welcome Back
            </h1>
            <p className="text-sm text-[#6B7280]">
              Sign in to your TransitOps account
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-3.5">
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
                  aria-describedby={errorEmail ? "email-error" : undefined}
                />
                {errorEmail && (
                  <p id="email-error" className="text-red-500 text-xs mt-1.5 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorEmail}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-medium text-[#374151]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 pr-9 rounded-lg bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1.5 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-describedby={errorPassword ? "password-error" : undefined}
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
                {errorPassword && (
                  <p id="password-error" className="text-red-500 text-xs mt-1.5 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorPassword}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                  <p className="text-red-600 text-xs flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {loginError}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-[1.01] transition-all duration-200 shadow-sm hover:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-[#2563EB] mb-2">Demo Credentials</p>
              <div className="space-y-1 text-[10px] text-[#374151]">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Admin:</span>
                  <span>admin@gmail.com / password</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Fleet:</span>
                  <span>fleet@gmail.com / password</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Dispatcher:</span>
                  <span>dispatcher@gmail.com / password</span>
                </div>
              </div>
            </div>

            {/* Sign Up */}
            <div className="text-center pt-3">
              <p className="text-xs text-[#6B7280]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-[#2563EB] hover:text-blue-700 font-semibold transition-colors"
                >
                  Create an account
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
              Streamline Your Fleet Operations
            </h3>
            <p className="text-blue-100 text-sm">
              Manage vehicles, drivers, trips, and maintenance with a single, powerful platform.
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

export default Login;

