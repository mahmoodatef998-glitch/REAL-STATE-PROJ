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
      
      <div className="relative bg-neutral-900 rounded-lg p-8 w-full max-w-md mx-4 border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white focus-ring"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
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
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.name ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Your full name"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.email ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="your.email@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg focus-ring"
            >
              <option value="broker">Real Estate Broker (Requires Approval)</option>
              <option value="client">Client</option>
            </select>
            {formData.role === 'broker' && (
              <p className="mt-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                ⚠️ Broker registration requires admin approval. Once approved, you can add and manage your properties.
              </p>
            )}
          </div>

          {formData.role === 'broker' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                  fieldErrors.phone ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="+971 50 123 4567"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>
              )}
              <p className="mt-1 text-xs text-neutral-400">
                Your phone number will be displayed on properties you list
              </p>
            </div>
          )}

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
              autoComplete="new-password"
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.password ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="At least 6 characters"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
                fieldErrors.confirmPassword ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="Confirm your password"
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-accent hover:text-accent/80 focus-ring"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
