"use client";
import { useState } from 'react';
import { api } from '../../lib/api/axios-client';
import { contactSchema } from '../../lib/validations/schemas';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Property Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setFieldErrors({});

    try {
      // Validate with Zod
      contactSchema.parse(formData);

      // Submit to backend
      await api.post('/leads', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || null,
        message: `${formData.subject}: ${formData.message}`
      });

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'Property Inquiry',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      
      // Handle Zod validation errors
      if (err.issues) {
        const errors = {};
        err.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setFieldErrors(errors);
        setError('Please fix the errors below');
      } else {
        // Handle API errors
        setError(err.response?.data?.error || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-sm">
          ✅ Message sent successfully! We&apos;ll get back to you soon.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
              fieldErrors.firstName ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder="Your first name"
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            autoComplete="family-name"
            className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
              fieldErrors.lastName ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder="Your last name"
          />
          {fieldErrors.lastName && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email *
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
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
          className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
            fieldErrors.phone ? 'border-red-500' : 'border-white/10'
          }`}
          placeholder="+971 50 123 4567"
        />
        {fieldErrors.phone && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg focus-ring"
        >
          <option value="Property Inquiry">Property Inquiry</option>
          <option value="General Question">General Question</option>
          <option value="Partnership">Partnership</option>
          <option value="Career Opportunity">Career Opportunity</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg focus-ring ${
            fieldErrors.message ? 'border-red-500' : 'border-white/10'
          }`}
          placeholder="Tell us how we can help you..."
        />
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-400">{fieldErrors.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

