"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GetInTouch() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsLoading(false);
        setSuccess(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    };

    return (
        <section className="section-padding relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-96 glow-mesh -z-10 opacity-20" />

            <div className="container-x">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-black tracking-tighter text-gradient mb-8"
                        >
                            LET'S TALK.<br />
                            <span className="text-white/20">CONNECT.</span>
                        </h2 >
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/40 text-lg font-medium leading-relaxed max-w-md"
                        >
                            Ready to secure your next investment or find your dream home? Our specialists are available for exclusive consultations.
                        </motion.p>

                        <div className="mt-16 space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Office</h4>
                                <p className="text-white/80 font-bold">Ajman One Towers, UAE</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Email</h4>
                                <p className="text-white/80 font-bold underline underline-offset-4">contact@alrabie.ae</p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bento-card"
                    >
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-medium"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-medium"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="1"
                                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-white font-medium resize-none"
                                    placeholder="Briefly describe your interest..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isLoading ? 'Sending...' : success ? 'Sent Successfully' : 'Send Message'}
                                {!isLoading && !success && <span>→</span>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
