'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Server, Code, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-slate-50 pt-16 pb-32 lg:pt-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Text Content */}
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-x-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/20 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Official TechFlow Partner
                            </span>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 leading-[1.1]">
                                Upgrade Your World with <span className="text-primary transparent-text-stroke">Premium Tech</span>
                            </h1>
                            <p className="text-lg leading-8 text-slate-600 mb-8 max-w-lg">
                                Discover enterprise-grade hardware, cutting-edge software, and world-class education designed to accelerate your growth.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <Link
                                    href="/category/hardware"
                                    className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary-hover hover:scale-105 transition-all duration-200"
                                >
                                    Start Shopping
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Link
                                    href="/category/education"
                                    className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-md ring-1 ring-slate-900/10 hover:bg-slate-50 hover:text-primary transition-all duration-200"
                                >
                                    Explore Courses
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <span>Verified Quality</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
                                    </div>
                                    <span>2k+ Happy Clients</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative lg:ml-auto"
                    >
                        {/* Decorative blobs */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10" />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Main Large Image (Hardware) */}
                            <div className="col-span-2 relative group overflow-hidden rounded-3xl shadow-2xl shadow-slate-200/50 aspect-[16/9]">
                                <img
                                    src="https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1200&auto=format&fit=crop"
                                    alt="Premium Hardware"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Server className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Hardware</span>
                                        </div>
                                        <p className="font-bold text-lg">Next-Gen Servers</p>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Image (Software) */}
                            <div className="relative group overflow-hidden rounded-3xl shadow-xl aspect-square">
                                <img
                                    src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop"
                                    alt="Software Solutions"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Code className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Tertiary Image (Education) */}
                            <div className="relative group overflow-hidden rounded-3xl shadow-xl aspect-square bg-slate-900">
                                <img
                                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"
                                    alt="Education"
                                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <GraduationCap className="h-8 w-8 text-white mx-auto mb-2 drop-shadow-md" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Learn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
