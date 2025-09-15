import Footer from '../Components/Footer';
import Header from '../Components/Header';

const Pricing = () => {
  return (
    <>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6B46C1] rounded-full opacity-25 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-96 h-96 bg-[#7C3AED] rounded-full opacity-20 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6B46C1]/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#7C3AED]/30 rounded-full translate-x-1/2 translate-y-1/2 blur-xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#6B46C1]/20 via-transparent to-[#7C3AED]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] font-inter text-gray-100 py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#6B46C1] tracking-tight drop-shadow-lg mb-4">
              Choose Your Art Journey
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Elevate your creativity with SnapStack.art's tailored pricing plans. Start free and unlock premium features today!
            </p>
            <a
              href="/subscribe"
              className="inline-block bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300"
            >
              Get Started Now
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl hover:-translate-y-2 hover:shadow-[#6B46C1]/60 transition-all duration-300 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Free</h2>
              <p className="text-4xl font-bold text-[#6B46C1] mb-4 text-center">$0</p>
              <ul className="text-gray-300 space-y-3 mb-6 text-center">
                <li>5 art uploads/month</li>
                <li>1080p resolution</li>
                <li>Basic community access</li>
                <li>Email support</li>
              </ul>
              <button
                className="w-full bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300"
                disabled
              >
                Current Plan
              </button>
            </div>

            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl hover:-translate-y-2 hover:shadow-[#6B46C1]/60 transition-all duration-300 animate-fadeIn delay-100">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Hobbyist</h2>
              <p className="text-4xl font-bold text-[#6B46C1] mb-4 text-center">$3.99/month</p>
              <ul className="text-gray-300 space-y-3 mb-6 text-center">
                <li>20 art uploads/month</li>
                <li>2K resolution</li>
                <li>Community highlights</li>
                <li>Priority email support</li>
              </ul>
              <a
                href="/subscribe?plan=hobbyist"
                className="w-full bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300 text-center block"
              >
                Subscribe Now
              </a>
            </div>

            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl hover:-translate-y-2 hover:shadow-[#6B46C1]/60 transition-all duration-300 animate-fadeIn delay-200">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Pro</h2>
              <p className="text-4xl font-bold text-[#6B46C1] mb-4 text-center">$7.99/month</p>
              <ul className="text-gray-300 space-y-3 mb-6 text-center">
                <li>Unlimited uploads</li>
                <li>4K resolution</li>
                <li>Analytics dashboard</li>
                <li>24/7 live support</li>
              </ul>
              <a
                href="/subscribe?plan=pro"
                className="w-full bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300 text-center block"
              >
                Subscribe Now
              </a>
            </div>

            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl hover:-translate-y-2 hover:shadow-[#6B46C1]/60 transition-all duration-300 animate-fadeIn delay-300">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4 text-center">Elite</h2>
              <p className="text-4xl font-bold text-[#6B46C1] mb-4 text-center">$14.99/month</p>
              <ul className="text-gray-300 space-y-3 mb-6 text-center">
                <li>Unlimited uploads + portfolio</li>
                <li>8K resolution</li>
                <li>Exclusive badges & events</li>
                <li>Dedicated account manager</li>
              </ul>
              <a
                href="/subscribe?plan=elite"
                className="w-full bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300 text-center block"
              >
                Subscribe Now
              </a>
            </div>
          </div>

          <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 mb-16 shadow-xl">
            <h2 className="text-2xl font-semibold text-[#6B46C1] mb-4 text-center">Plan Comparison</h2>
            <table className="w-full text-gray-300">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="py-3 text-left">Feature</th>
                  <th className="py-3">Free</th>
                  <th className="py-3">Hobbyist</th>
                  <th className="py-3">Pro</th>
                  <th className="py-3">Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2">Uploads/Month</td>
                  <td>5</td>
                  <td>20</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2">Max Resolution</td>
                  <td>1080p</td>
                  <td>2K</td>
                  <td>4K</td>
                  <td>8K</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2">Analytics</td>
                  <td>-</td>
                  <td>-</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-2">Support</td>
                  <td>Email</td>
                  <td>Priority Email</td>
                  <td>24/7 Live</td>
                  <td>Dedicated</td>
                </tr>
                <tr>
                  <td className="py-2">Exclusive Perks</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Badges & Events</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl">
              <p className="text-gray-300 italic mb-2">"Pro plan's analytics helped me grow my audience!"</p>
              <p className="text-gray-400 text-sm">- Artist Mia, 8 months</p>
            </div>
            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl">
              <p className="text-gray-300 italic mb-2">"Elite's 8K support is stunning for my prints."</p>
              <p className="text-gray-400 text-sm">- Photographer Leo, 1.5 years</p>
            </div>
            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-6 shadow-xl">
              <p className="text-gray-300 italic mb-2">"Hobbyist plan was perfect to start my journey!"</p>
              <p className="text-gray-400 text-sm">- Designer Emma, 3 months</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-12">
            For detailed subscription options and updates, visit{' '}
            <a href="https://snapstack.art/subscribe" className="text-[#6B46C1] hover:text-[#7C3AED] underline transition-all duration-300">
              https://snapstack.art/subscribe
            </a>. Pricing and limits are subject to change.
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            SnapStack.art &copy; {new Date().getFullYear()} - All rights reserved.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;