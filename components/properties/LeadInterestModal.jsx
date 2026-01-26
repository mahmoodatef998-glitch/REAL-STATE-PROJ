"use client";
import { useState } from 'react';
import { useCreateLead } from '../../hooks/useLeads';
import { getGuestId } from '../../lib/utils/tracking';

export default function LeadInterestModal({ isOpen, onClose, property, openEmailAfterSubmit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const createLead = useCreateLead();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const leadData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        property_id: property.id,
        guest_id: getGuestId()
      };

      const result = await createLead.mutateAsync(leadData);

      if (result.success) {
        setSuccessMessage(result.message || 'Your interest has been recorded! The broker will contact you soon.');

        // If openEmailAfterSubmit is true, open Gmail with broker email
        if (openEmailAfterSubmit && property?.owner?.email) {
          const emailSubject = `Interest in ${property.title}`;
          const emailBody = `Hi,

I'm interested in this property:

Property: ${property.title}
Property ID: ${property.id}
Location: ${property.emirate}${property.location ? ` - ${property.location}` : ''}
Price: ${property.price?.toLocaleString()} AED

My Contact Information:
Name: ${formData.name}
Phone: ${formData.phone}

Please contact me at your earliest convenience.

Thank you!`;

          // Create mailto link
          const mailtoLink = `mailto:${property.owner.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

          // Open email client
          window.location.href = mailtoLink;
        }

        setFormData({ name: '', phone: '' });

        // Close modal after 2 seconds
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors({
        submit: error.response?.data?.error || 'Failed to submit. Please try again.'
      });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '' });
    setErrors({});
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative bg-neutral-900 rounded-lg shadow-xl border border-white/10 max-w-md w-full p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors focus-ring rounded"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            I&apos;m Interested!
          </h2>
          <p className="text-neutral-300 text-sm">
            {property?.title || 'This Property'}
          </p>
          <p className="text-neutral-400 text-xs mt-1">
            Leave your contact details and the broker will reach out to you shortly.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-2">
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-neutral-800 border ${errors.name ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors`}
              placeholder="Enter your full name"
              disabled={createLead.isPending || successMessage}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-200 mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-neutral-800 border ${errors.phone ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors`}
              placeholder="+971 50 123 4567"
              disabled={createLead.isPending || successMessage}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors focus-ring"
              disabled={createLead.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createLead.isPending || successMessage}
            >
              {createLead.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Interest'
              )}
            </button>
          </div>
        </form>

        {/* Privacy Note */}
        <p className="mt-4 text-xs text-neutral-500 text-center">
          Your information will only be shared with the property&apos;s broker.
        </p>
      </div>
    </div>
  );
}
