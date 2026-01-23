"use client";
import { useState } from 'react';
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

      <div className="relative bg-neutral-900 rounded-lg p-8 w-full max-w-md mx-4 border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white focus-ring"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.email ? 'border-red-500' : 'border-white/10'
                }`}
              placeholder="your.email@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
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
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${fieldErrors.password ? 'border-red-500' : 'border-white/10'
                }`}
              placeholder="Your password"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-accent hover:text-accent/80 focus-ring"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-neutral-800 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Demo Accounts:</h3>
          <div className="text-xs text-neutral-400 space-y-1">
            <div><strong>Admin:</strong> admin@test.com / Test123!@#</div>
            <div><strong>Broker:</strong> broker@test.com / Test123!@#</div>
          </div>
        </div>
      </div>
    </div>
  );
}
