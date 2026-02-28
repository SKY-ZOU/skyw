import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Business from '@/components/Business';
import News from '@/components/News';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Business />
      <News />
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            开启黄金投资新时代
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            了解 G-COIN 数字黄金，体验传统黄金与数字金融的完美融合
          </p>
          <a href="/gcoin" className="btn-gold inline-flex items-center text-lg px-8 py-4">
            立即了解
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
