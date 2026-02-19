import { useState, useEffect } from "react";
import { LuLogIn, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
// import logo from "../logo.svg";
import NGOimage from "../assets/images/gettyimages-2161654610-612x612.jpg";
import legalAdviceimage from "../assets/images/istockphoto-1062933252-612x612.jpg";
import justiceimage from "../assets/images/istockphoto-155157834-612x612.jpg";
import matching from "../assets/images/matching.jpg";
import verified from "../assets/images/istockphoto-1062933252-612x612.jpg";
import secureandconfi from "../assets/images/security_confidential.jpg";
import casemanagement from "../assets/images/casemanagement.jpg";
import legalresources from "../assets/images/legalresource.avif";
import community from "../assets/images/community.jpg";
import service from "../assets/images/ngoservice.jpg";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "../auth/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.title = "Home | Legal Aid";
  }, []);

  const slides = [
    {
      image: justiceimage,
      title: "Justice for All",
      description: "Connecting citizens with verified legal aid providers."
    },
    {
      image: NGOimage,
      title: "NGO Support",
      description: "Collaborate with NGOs dedicated to social justice."
    },
    {
      image: legalAdviceimage,
      title: "Expert Legal Advice",
      description: "Get guidance from experienced and verified lawyers."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* <img src={""} alt="Legal Aid Logo" className="h-10 w-10" /> */}
            <h1 className="text-xl md:text-2xl font-bold text-blue-950 tracking-tight">
              LEGAL AID MATCHING PLATFORM
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
            <a href="#features" className="hover:text-blue-900 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-900 transition-colors">About</a>
            <a href="#faq" className="hover:text-blue-900 transition-colors">Help Center</a>
            <a href="#contact" className="hover:text-blue-900 transition-colors">Contact</a>
          </nav>

          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                navigate("/dashboard");
              }
            }}
            className="px-5 py-2 bg-black text-white rounded-full hover:bg-blue-950
                flex items-center gap-2 font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <LuLogIn /> Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl z-10">
            {/* <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Bridging the Gap to <span className="text-blue-300">Legal Justice</span>
            </h2> */}
            <TypeAnimation sequence={["We connect you with the justice...",1000,"Supported By NGOs",1000]} className="font-mono text-4xl md:text-5xl font-extrabold mb-6 leading-tight" wrapper="span" speed={30} repeat={Infinity}/>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Legal aid matching platform, Trusted by verified lawyers, NGOs and many more organizations
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-white text-blue-950 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
              >
                Get Started
              </button>
              <a
                href="#features"
                className="px-8 py-3 border-2 border-blue-300 text-blue-100 font-bold rounded-lg hover:bg-blue-900 hover:text-white transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative w-full md:w-1/2 max-w-lg">
             <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
             <img
              src={justiceimage}
              alt="Legal Justice"
              className="relative w-full rounded-2xl shadow-2xl border-4 border-blue-900/30 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl group">
                <div
                    className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="min-w-full h-full relative">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black/40">
                                <h3 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h3>
                                <p className="text-lg md:text-xl">{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                    <LuChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                    <LuChevronRight size={24} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers comprehensive tools to streamline legal assistance and ensure transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group p-6 bg-black rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden rounded-xl mb-6">
                <img
                  src={matching}
                  alt="User Matching"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Smart Matching</h4>
              <p className="text-gray-400 leading-relaxed">
                Our AI-driven algorithm connects citizens with the most suitable lawyers and NGOs based on case type, location, and expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 bg-black rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden rounded-xl mb-6">
                <img
                  src={verified}
                  alt="Verified Professionals"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Verified Directory</h4>
              <p className="text-gray-400 leading-relaxed">
                Access a trusted network of verified legal professionals and registered NGOs. Every profile is vetted for authenticity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 bg-black rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden rounded-xl mb-6">
                <img
                  src={secureandconfi}
                  alt="Secure Communication"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Secure & Confidential</h4>
              <p className="text-gray-400 leading-relaxed">
                Communicate safely with end-to-end encryption. Your case details and personal information remain strictly confidential.
              </p>
            </div>
             {/* Feature 4 */}
             <div className="group p-6 bg-black rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden rounded-xl mb-6">
                <img
                  src={casemanagement}
                  alt="Document Management"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Case Management</h4>
              <p className="text-gray-400 leading-relaxed">
                Organize your legal documents, track case progress, and manage appointments all in one secure dashboard.
              </p>
            </div>
             {/* Feature 5 */}
             <div className="group p-6 bg-black rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden rounded-xl mb-6">
                <img
                  src={legalresources}
                  alt="Legal Resources"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Legal Resources</h4>
              <p className="text-gray-400 leading-relaxed">
                Access a library of legal guides, FAQs, and templates to help you understand your rights and legal procedures.
              </p>
            </div>
             {/* Feature 6 */}
             <div className="group p-6 bg-black rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden rounded-xl mb-6">
                <img
                  src={community}
                  alt="Community Support"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Community Support</h4>
              <p className="text-gray-400 leading-relaxed">
                Connect with support groups and community organizations for additional assistance beyond legal representation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <img
              src={service}
              alt="About Us"
              className="rounded-2xl shadow-2xl w-full object-cover h-96"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Our Mission</h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The Legal-Aid Matching Platform is an initiative dedicated to democratizing access to justice. We believe that quality legal representation should not be a privilege but a fundamental right.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              By leveraging technology, we bridge the gap between underserved communities and legal professionals willing to offer their expertise pro bono or at reduced costs.
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <span className="block text-3xl font-bold text-blue-900">500+</span>
                    <span className="text-gray-600 text-sm">Verified Lawyers</span>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <span className="block text-3xl font-bold text-blue-900">100+</span>
                    <span className="text-gray-600 text-sm">Partner NGOs</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Center / FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Help Center</h3>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">How do I find a lawyer?</h4>
              <p className="text-gray-600">
                Simply sign up as a citizen, submit your case details, and our smart matching system will recommend suitable lawyers based on your needs. You can also browse our directory.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Is this service free?</h4>
              <p className="text-gray-600">
                Registration is free for all users. Many lawyers on our platform offer pro bono (free) services for eligible citizens. Fees for other services are transparently discussed between you and the lawyer.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">How are lawyers verified?</h4>
              <p className="text-gray-600">
                We strictly verify every lawyer's credentials with the Bar Council before their profile goes live. NGOs are also verified against government registries.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Is my data safe?</h4>
              <p className="text-gray-600">
                Yes, we use industry-standard encryption to protect your personal information and case details. Your privacy is our top priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-950 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={""} alt="Legal Aid Logo" className="h-10 w-10 brightness-0 invert" />
                <h2 className="text-xl font-bold">LEGAL-AID MATCHING PLATFORM</h2>
              </div>
              <p className="text-blue-200 mb-6 max-w-md">
                Empowering citizens with legal knowledge and access to justice. Join us in building a fairer society for everyone.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/signup" className="hover:text-white transition-colors">Login / Register</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2 inline-block">Contact Us</h4>
              <ul className="space-y-3 text-blue-200">
                <li className="flex items-start gap-3">
                  <span>📧</span>
                  <a href="mailto:support@legalaidplatform.com" className="hover:text-white transition-colors">support@legalaidplatform.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <span>📍</span>
                  <span>123 Justice Lane, Legal District, New Delhi, India</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>📞</span>
                  <span>+91 1800-123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-900 pt-8 text-center text-blue-300 text-sm">
            <p>© {new Date().getFullYear()} Legal-Aid Matching Platform. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}