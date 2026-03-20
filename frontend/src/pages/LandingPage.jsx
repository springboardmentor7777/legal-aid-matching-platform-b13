import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Briefcase, Building2, ArrowRight, Scale, Heart, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Shield className="text-indigo-600" size={28} />
                            <span className="text-xl font-bold text-gray-900">LegalMatch Pro</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="py-20 lg:py-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                            <div className="mb-12 lg:mb-0">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                                    Justice for Everyone
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                    Legal Aid <br />
                                    <span className="text-indigo-600">Matching Platform</span>
                                </h1>
                                <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                                    Connecting citizens, lawyers, and NGOs to provide seamless legal assistance and support for those who need it most.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                        Create Account <ArrowRight size={18} className="ml-2" />
                                    </Link>
                                    <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                        Sign In
                                    </Link>
                                </div>
                            </div>

                            {/* Right side info cards */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                        <Scale size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Expert Lawyers</div>
                                        <div className="text-xs text-gray-500">500+ verified legal professionals</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">4.9</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">High Success Rate</div>
                                        <div className="text-xs text-gray-500">Based on 10,000+ cases resolved</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">NGO Partnerships</div>
                                        <div className="text-xs text-gray-500">100+ NGOs providing free legal aid</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">One Platform, Three Ecosystems</h2>
                        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                            Empowering every stakeholder in the legal aid process.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-5 mx-auto">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">For Citizens</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Find specialized lawyers and get free legal consultations through vetted NGOs.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-5 mx-auto">
                                    <Briefcase size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">For Lawyers</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Manage pro-bono cases efficiently and expand your impact profile.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5 mx-auto">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">For NGOs</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Coordinate legal aid missions and connect resources where they matter most.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                            <div className="mb-10 lg:mb-0">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-4">About Us</h2>
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    At LegalMatch Pro, we believe that access to justice is a fundamental right, not a privilege. Our platform was founded to bridge the critical gap between citizens seeking legal assistance and the professionals ready to help them.
                                </p>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    By leveraging technology, we streamline the matching process, ensuring that every case finds its right advocate, while bringing NGOs and pro-bono lawyers into a single, cohesive ecosystem.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Mission-driven matching algorithm',
                                        'Verified network of professionals',
                                        'Completely free for citizens requiring legal aid'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <CheckCircle className="text-emerald-500 mr-3" size={20} />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                                    <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply opacity-10"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
                                    {/* Placeholder for an office/legal themed image */}
                                    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-200">
                                        <Scale className="text-indigo-200" size={120} />
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-12">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Hidden line connecting steps on large screens */}
                            <div className="hidden md:block absolute top-[20px] left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                            {[
                                { step: '1', title: 'Create an Account', desc: 'Sign up as a Citizen, Lawyer, or NGO with a simple registration form.' },
                                { step: '2', title: 'Get Matched', desc: 'Our system matches citizens with relevant lawyers and NGOs based on case type.' },
                                { step: '3', title: 'Resolve Your Case', desc: 'Work together through the platform to track progress and reach resolution.' },
                            ].map((item) => (
                                <div key={item.step} className="flex flex-col items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-6 text-xl shadow-md ring-4 ring-white">{item.step}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-indigo-600 rounded-2xl p-10 text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">Ready to find the right legal help?</h2>
                            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                                Join thousands of individuals who have found justice through our platform.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                                    Sign Up Now
                                </Link>
                                <Link to="/login" className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-6">
                                <Shield className="text-indigo-400" size={28} />
                                <span className="text-xl font-bold text-white">LegalMatch Pro</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Bridging the gap between justice and people. A comprehensive matching platform connecting citizens with dedicated legal experts and NGOs.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-5">Platform</h3>
                            <ul className="space-y-3">
                                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">For Citizens</Link></li>
                                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">For Lawyers</Link></li>
                                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">For NGOs</Link></li>
                                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Sign In</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-5">Legal</h3>
                            <ul className="space-y-3">
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-5">Newsletter</h3>
                            <p className="text-gray-400 mb-4 text-sm">Get the latest legal updates directly in your inbox.</p>
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="flex-1 px-4 py-2 border border-transparent rounded-l-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                                <button type="button" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium">
                                    Join
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2025 LegalMatch Pro. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
                            <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
