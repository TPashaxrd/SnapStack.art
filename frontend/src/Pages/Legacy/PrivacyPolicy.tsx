import Footer from '../../Components/Footer';
import Header from '../../Components/Header';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="min-h-screen bg-[#0F0F0F] font-inter text-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#6B46C1] tracking-tight text-center mb-8">
            Privacy Policy
          </h1>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Introduction</h2>
            <p className="text-gray-300">
              At SnapStack.art ("we", "us", or "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. Information We Collect</h2>
            <p className="text-gray-300">
              We collect the following information: (a) Account details (e.g., username, email, IP address) provided during registration, (b) User Content (e.g., artwork, tags) you upload, and (c) Usage data (e.g., browsing activity) collected via cookies.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300">
              We use your information to: (a) Provide and maintain the Service, (b) Personalize your experience, (c) Send notifications or marketing emails (with your consent), and (d) Ensure compliance with legal obligations.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Data Sharing</h2>
            <p className="text-gray-300">
              We do not sell your personal data. We may share it with third-party service providers (e.g., for hosting, analytics) or as required by law. Your User Content may be publicly visible unless you adjust privacy settings.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Your Rights</h2>
            <p className="text-gray-300">
              You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:support@snapstack.art" className="text-[#6B46C1] hover:text-[#7C3AED] underline transition-all duration-300">support@snapstack.art</a>. We retain data as long as necessary for the Service's operation.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Security</h2>
            <p className="text-gray-300">
              We implement reasonable security measures to protect your data, but no online service is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy periodically. Changes will be posted here with the updated date, and we encourage you to review it regularly.
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

export default PrivacyPolicy;