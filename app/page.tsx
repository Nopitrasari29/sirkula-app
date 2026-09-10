import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';

export default function LandingPage() {
  return (
    <div className="relative bg-[#F5F3E9] text-[#1C4D38] font-sans overflow-hidden min-h-screen">
      
      {/* 🍃 1. Top Hanging Leaf Garland (Soft & Elegant Opacity 20%) */}
      <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-20 z-0 overflow-hidden">
        <img
          src="/assets/illustrations/leaf-garland-top.png"
          alt="Top Leaf Garland Watermark"
          className="w-full h-auto max-h-[360px] object-cover object-top filter drop-shadow-xs"
        />
      </div>

      {/* 🍃 2. Continuous Left & Right Side Falling Leaves Watermarks (Soft & Elegant Opacity 15%) */}
      <div className="absolute inset-0 pointer-events-none opacity-15 z-0">
        {/* Left Side Falling Leaves Columns */}
        <div className="absolute top-[6%] -left-10 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
        <div className="absolute top-[30%] -left-14 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
        <div className="absolute top-[56%] -left-12 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
        <div className="absolute top-[80%] -left-10 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />

        {/* Right Side Falling Leaves Columns */}
        <div className="absolute top-[12%] -right-10 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
        <div className="absolute top-[36%] -right-14 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
        <div className="absolute top-[62%] -right-12 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
        <div className="absolute top-[86%] -right-10 w-96 h-[650px] bg-contain bg-no-repeat bg-[url('/assets/illustrations/falling-green-leaves.png')]" />
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </div>

    </div>
  );
}