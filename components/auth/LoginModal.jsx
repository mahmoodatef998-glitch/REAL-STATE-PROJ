"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema } from '../../lib/validations/schemas';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Validate with Zod
      loginSchema.parse(formData);
    } catch (err) {
      if (err.issues) {
        const errors = {};
        err.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setFieldErrors(errors);
        setError('Please fix the errors below');
      } else {
        setError(err.message || 'Validation failed');
      }
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (result.user?.role === 'broker') {
        router.push('/broker/dashboard');
      }
      onClose();
      setFormData({ email: '', password: '' });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 w-full max-w-[400px] mx-4 border border-neutral-200 dark:border-white/10 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <span className="shrink-0">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.email ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                }`}
              placeholder="name@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400 ml-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.password ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                }`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400 ml-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-accent/20 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-accent font-semibold hover:text-accent/80 transition-colors"
            >
              Create one
            </button>
          </p>
        </div>

        <div className="mt-8 p-4 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-white/5">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-tighter mb-3">Demo Access</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center p-2 rounded-lg bg-neutral-100 dark:bg-white/5">
              <span className="text-xs text-neutral-600 dark:text-neutral-300">Admin</span>
              <code className="text-[10px] text-accent font-medium">admin@test.com</code>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-neutral-100 dark:bg-white/5">
              <span className="text-xs text-neutral-600 dark:text-neutral-300">Broker</span>
              <code className="text-[10px] text-accent font-medium">broker@test.com</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
