import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

interface User {
  id: string;
  email: string;
}

export default function Subscribe() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Extract plan from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    setSelectedPlan(plan || null);

    // Fetch user data
    axios
      .get('http://localhost:5000/api/user/me', { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => alert('Kullanıcı giriş yapmamış'));
  }, []);

  useEffect(() => {
    // Set amount based on selected plan
    switch (selectedPlan) {
      case 'hobbyist':
        setAmount(399); // 3.99 TRY
        break;
      case 'pro':
        setAmount(799); // 7.99 TRY
        break;
      case 'elite':
        setAmount(1499); // 14.99 TRY
        break;
      default:
        setAmount(0); // Free plan
    }
  }, [selectedPlan]);

  const handleSubscription = async () => {
    if (!user) return alert('Kullanıcı bulunamadı');
    if (!selectedPlan || selectedPlan === 'free') return alert('Lütfen bir ücretli plan seçin');

    try {
      const res = await axios.post(
        'http://localhost:5000/create-payment',
        { amount, buyerEmail: user.email, plan: selectedPlan },
        { withCredentials: true }
      );

      // Shopier ödeme sayfasına yönlendir
      window.location.href = res.data.url;
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert('Abonelik oluşturulamadı');
    }
  };

  const plans = [
    { name: 'Free', price: 0, features: ['5 art uploads/month', '1080p resolution', 'Basic community access', 'Email support'] },
    { name: 'Hobbyist', price: 3.99, features: ['20 art uploads/month', '2K resolution', 'Community highlights', 'Priority email support'] },
    { name: 'Pro', price: 7.99, features: ['Unlimited uploads', '4K resolution', 'Analytics dashboard', '24/7 live support'] },
    { name: 'Elite', price: 14.99, features: ['Unlimited uploads + portfolio', '8K resolution', 'Exclusive badges & events', 'Dedicated account manager'] },
  ];

  return (
    <>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6B46C1] rounded-full opacity-25 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-96 h-96 bg-[#7C3AED] rounded-full opacity-20 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6B46C1]/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#7C3AED]/30 rounded-full translate-x-1/2 translate-y-1/2 blur-xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#6B46C1]/20 via-transparent to-[#7C3AED]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] font-inter text-gray-100 py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#6B46C1] tracking-tight drop-shadow-lg mb-4">
              Subscribe to Your Plan
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Unlock new features and elevate your art experience with SnapStack.art. Select and subscribe now!
            </p>
            <a
              href="/select-plan"
              className="inline-block bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300"
            >
              View Plans
            </a>
          </div>

          {/* Plan Selection and Subscription */}
          <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl border border-gray-800/50 p-8 shadow-xl hover:shadow-[#6B46C1]/50 transition-all duration-300 animate-fadeIn">
            <h2 className="text-3xl font-extrabold text-[#6B46C1] tracking-tight mb-6 text-center">
              Choose Your Subscription
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Select a plan below or confirm your pre-selected plan to proceed with subscription.
            </p>

            <div className="space-y-6">
              {/* Plan Selection Dropdown */}
              <div>
                <label className="block text-gray-100 mb-2 text-lg">Select Plan</label>
                <select
                  value={selectedPlan || ''}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-[#2D2D2D] border border-gray-800/50 rounded-lg p-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                >
                  <option value="" disabled>Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.name.toLowerCase()} value={plan.name.toLowerCase()}>
                      {plan.name} - ${plan.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Details */}
              {selectedPlan && (
                <div className="bg-[#2D2D2D] p-4 rounded-lg border border-gray-800/50">
                  <h3 className="text-xl font-semibold text-[#6B46C1] mb-2">
                    {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
                  </h3>
                  <p className="text-gray-300 mb-2">Price: ${plans.find((p) => p.name.toLowerCase() === selectedPlan)?.price || 0}</p>
                  <ul className="text-gray-300 space-y-1">
                    {plans.find((p) => p.name.toLowerCase() === selectedPlan)?.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subscription Button */}
              <button
                onClick={handleSubscription}
                className="w-full bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300 animate-pulse-slow"
                disabled={!selectedPlan || selectedPlan === 'free' || !user}
              >
                {user ? 'Subscribe Now' : 'Please Log In'}
              </button>
            </div>

            {user && (
              <p className="text-center text-gray-400 mt-4">
                Subscription will be processed for {user.email}. Contact{' '}
                <a
                  href="mailto:support@snapstack.art"
                  className="text-[#6B46C1] hover:text-[#7C3AED] underline transition-all duration-300"
                >
                  support@snapstack.art
                </a>{' '}
                for assistance.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}