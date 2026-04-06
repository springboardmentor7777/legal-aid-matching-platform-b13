import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Scale } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const userData = await login({
          email,
          password
        });
        // Normalize: AuthContext already strips ROLE_ but be safe
        let role = (userData?.role || '').toUpperCase();
        if (role.startsWith('ROLE_')) role = role.substring(5);
        const onboardingDone = userData?.onboardingComplete;

        if (role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'CITIZEN') {
          navigate('/dashboard');
        } else if (role === 'LAWYER' || role === 'NGO') {
          navigate(onboardingDone ? '/dashboard' : '/onboarding');
        } else {
          // Unknown role — never block, send to dashboard
          navigate('/dashboard');
        }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
          alt="Scales of justice"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md" style={{ backgroundColor: '#1e3a5f' }}>
              <Scale className="w-9 h-9 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-900 mb-1">Welcome Back</h1>
          <p className="text-center text-slate-500 text-base mb-8">Sign in to your account to continue.</p>

          {/* OAuth Buttons */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400 whitespace-nowrap">Or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Email or Username</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ left: '14px' }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                  className="w-full py-3 pr-4 border border-slate-300 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ left: '14px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full py-3 border border-slate-300 rounded-xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-700"
                  style={{ right: '14px' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot your password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white text-base font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="text-center text-base text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">Sign Up</Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
            By continuing, you agree to LegalMatch Pro's{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
