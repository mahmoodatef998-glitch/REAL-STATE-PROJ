"use client";
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { registerSchema } from '../../lib/validations/schemas';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'broker',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      // Validate with Zod
      registerSchema.parse({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || ''
      });
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

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      // Check if requires approval
      if (result.requiresApproval) {
        // Show success message instead of error
        setError('');
        setLoading(false);
        alert('Registration successful! Your account is pending admin approval. You will be able to login once approved.');
        onClose();
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'broker'
        });
        return;
      } else {
        onClose();
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'broker'
        });
      }
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

      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 w-full max-w-[450px] mx-4 border border-neutral-200 dark:border-white/10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full z-10"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">Join us to explore premium real estate opportunities</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <span className="shrink-0">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.name ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                  }`}
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-[10px] text-red-400 ml-1">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
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
                className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.email ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                  }`}
                placeholder="name@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-[10px] text-red-400 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20 rounded-xl focus-ring transition-all appearance-none cursor-pointer text-neutral-900 dark:text-white"
              >
                <option value="broker">Real Estate Broker</option>
                <option value="client">Client</option>
              </select>
            </div>

            {formData.role === 'broker' && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="phone" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.phone ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  placeholder="+971 50 123 4567"
                />
                <p className="text-[10px] text-neutral-500 mt-1 ml-1 flex items-center gap-1">
                  <span>ℹ️</span> Displayed on your property listings
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.password ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus-ring transition-all ${fieldErrors.confirmPassword ? 'border-red-500/50' : 'border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {(fieldErrors.password || fieldErrors.confirmPassword) && (
              <p className="text-[10px] text-red-400 ml-1">
                {fieldErrors.password || fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-accent/20 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-accent font-semibold hover:text-accent/80 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
