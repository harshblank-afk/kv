import Hero from '@/components/Hero';
import WaitlistForm from '@/components/WaitlistForm';
import NewsletterForm from '@/components/NewsletterForm';
// import Careers from '@/components/Careers';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WaitlistForm />
      <NewsletterForm />
      {/* <Careers /> */}
      <About />
      <Footer />
    </main>
  );
}
