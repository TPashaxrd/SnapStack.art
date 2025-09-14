import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const TermsOfService = () => {
  return (
    <>
      <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="min-h-screen bg-[#0F0F0F] font-inter text-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#6B46C1] tracking-tight text-center mb-8">
            Terms of Service
          </h1>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing or using SnapStack.art ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service. We reserve the right to update these Terms at any time, with notice provided via the platform.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. User Content</h2>
            <p className="text-gray-300">
              Users may upload artwork ("User Content") to SnapStack.art. You retain ownership of your content, but by uploading, you grant us a non-exclusive, worldwide license to display, distribute, and promote it on the Service. You are responsible for ensuring your content complies with all applicable laws and does not infringe on third-party rights.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. Prohibited Conduct</h2>
            <p className="text-gray-300">
              You agree not to use the Service for illegal activities, harassment, or uploading harmful content (e.g., malware, explicit material). Violations may result in account suspension or termination.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Privacy</h2>
            <p className="text-gray-300">
              Your privacy is important. Please review our <a href="/privacy-policy" className="text-[#6B46C1] hover:text-[#7C3AED] underline transition-all duration-300">Privacy Policy</a> for details on how we collect, use, and protect your data.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Termination</h2>
            <p className="text-gray-300">
              We may terminate or suspend your account at our discretion for breach of these Terms. Upon termination, your access to the Service and User Content will be revoked.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-300">
              SnapStack.art is provided "as is" without warranties. We are not liable for any indirect damages arising from your use of the Service.
            </p>
          </section>

          <p className="text-center text-sm text-gray-400 mt-8">
            SnapStack.art &copy; {new Date().getFullYear()} - All rights reserved.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;