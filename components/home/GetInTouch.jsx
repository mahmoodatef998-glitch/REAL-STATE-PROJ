"use client";
import { useState } from 'react';
import { api } from '../../lib/api/axios-client';
import { contactSchema } from '../../lib/validations/schemas';

export default function GetInTouch() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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
            contactSchema.parse({
                ...formData,
                subject: 'General Inquiry'
            });

            // Submit to backend
            await api.post('/leads', {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone || null,
                message: formData.message
            });

            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });

            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Contact form error:', err);
            if (err.issues) {
                const errors = {};
                err.issues.forEach((issue) => {
                    errors[issue.path[0]] = issue.message;
                });
                setFieldErrors(errors);
                setError('Please fix the errors below');
            } else {
                setError(err.response?.data?.error || 'Failed to send message. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-neutral-900 border-t border-white/5">
            <div className="container-x">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Have a question or interested in our services? Fill out the form below and our team will get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="bg-neutral-800/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-fade-in">
                                    ⚠️ {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm animate-fade-in">
                                    ✅ Your message has been sent successfully! We will contact you soon.
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label htmlFor="firstName" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-xl focus-ring transition-all ${fieldErrors.firstName ? 'border-red-500/50' : 'border-white/5 hover:border-white/20'
                                            }`}
                                        placeholder="John"
                                    />
                                    {fieldErrors.firstName && (
                                        <p className="text-[10px] text-red-400 ml-1">{fieldErrors.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="lastName" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-xl focus-ring transition-all ${fieldErrors.lastName ? 'border-red-500/50' : 'border-white/5 hover:border-white/20'
                                            }`}
                                        placeholder="Doe"
                                    />
                                    {fieldErrors.lastName && (
                                        <p className="text-[10px] text-red-400 ml-1">{fieldErrors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-xl focus-ring transition-all ${fieldErrors.email ? 'border-red-500/50' : 'border-white/5 hover:border-white/20'
                                            }`}
                                        placeholder="john@example.com"
                                    />
                                    {fieldErrors.email && (
                                        <p className="text-[10px] text-red-400 ml-1">{fieldErrors.email}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-xl focus-ring transition-all ${fieldErrors.phone ? 'border-red-500/50' : 'border-white/5 hover:border-white/20'
                                            }`}
                                        placeholder="+971 50 123 4567"
                                    />
                                    {fieldErrors.phone && (
                                        <p className="text-[10px] text-red-400 ml-1">{fieldErrors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="message" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-xl focus-ring transition-all resize-none ${fieldErrors.message ? 'border-red-500/50' : 'border-white/5 hover:border-white/20'
                                        }`}
                                    placeholder="How can we help you?"
                                />
                                {fieldErrors.message && (
                                    <p className="text-[10px] text-red-400 ml-1">{fieldErrors.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent/20"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Message...
                                    </span>
                                ) : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
