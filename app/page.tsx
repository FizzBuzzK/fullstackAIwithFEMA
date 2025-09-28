// app/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  HouseHeart,
  Smartphone,
  Share2,
  ShieldPlus ,
  Brain
} from "lucide-react";


/**
 * ========================================================
 * Default homepage for the root route (/)
 * @returns 
 * ========================================================
 */
export default function Home() {

  //==========================================================
  return (
    <div className="relative min-h-screen">

      {/* Hero Section */}
      <section className="h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-sky-800 z-0">
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-4 w-full max-w-4xl">

              <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
                Find Your Dream Home
              </h1>

              <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
                Smarter, Safer Home Search
              </h1>

              <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
                Backed by{" "}
                <span className="inline-block">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text animate-pulse">
                    FEMA + AI
                  </span>
                </span>
              </h1>

              <p className="text-lg text-white mt-20 mx-auto">
                Our AI-powered real estate platform helps you explore properties with confidence - analyzing flood risks 
                instantly from location and images so you can make safer decisions.
                Traditional property listings show features and prices. 
                We go further - integrating AI flood risk detection so you can understand potential hazards 
                before making life’s biggest investment.
              </p>

            </div>
          </div>
        </div>
        
      </section>


      {/* Features Section */}
      <section id="features" className="py-40 px-4 bg-gradient-to-b from-sky-800 to-amber-100 z-0">
        <div className="container mx-auto">

          <h2 className="text-3xl font-bold text-center mb-20">
            Why Use Our AI-Enhanced Real Estate Marketplace?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<HouseHeart className="w-12 h-12 text-green-500" />}
              title="Peace of Mind"
              description="Instead of being captivated by a home's cosmetic appeal, 
              conduct thorough inspections to uncover any potential risks. 
              True peace of mind comes from understanding the house's true condition, not from a simple walk-through. 
              By investigating potential issues upfront, you can make a fully informed decision and avoid costly surprises later on."
            />

            <FeatureCard
              icon={<ShieldPlus  className="w-12 h-12 text-blue-500" />}
              title="Trusted Data"
              description="By integrating data from the official FEMA National Flood Hazard Layer (NFHL) with the Google Maps API, 
              a platform provides the most current flood zone information. 
              This fusion offers users a reliable, map-based visualization of flood risk for a specific location. 
              The combination of FEMA's regulatory data with the familiar, high-quality basemaps of Google ensures precise and trusted information."
            />

            <FeatureCard
              icon={<Brain className="w-12 h-12 text-pink-400" />}
              title="AI-Driven Analysis"
              description="Harnessing advanced AI, a platform can swiftly process vast amounts of data to produce valuable, intelligent insights. 
              This technology automates complex analysis, 
              allowing users to move beyond surface-level information and quickly discover actionable intelligence. 
              The result is faster, data-backed decisions that drive smarter outcomes in seconds."
            />
          </div>
        </div>
      </section>


      {/* Call-to-Action Section */}
      <section className="h-full bg-gradient-to-b from-amber-100 to-slate-50 z-0 text-black py-40 px-4">
        <div className="container mx-auto text-center">

          <h2 className="text-3xl font-bold mb-20">
            Safer Homes in Seconds. Building Safer Communities, One Home at a Time.
          </h2>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 mb-2" />
              <span>Find Flood Zone</span>
            </div>

            <div className="flex flex-col items-center">
              <Smartphone className="w-12 h-12 mb-2" />
              <span>Mobile-Friendly</span>
            </div>

            <div className="flex flex-col items-center">
              <Share2 className="w-12 h-12 mb-2" />
              <span>Share Favorites</span>
            </div>
          </div>

          <p className="text-xl mb-20 mx-auto">
            No more surprises. Our AI combines FEMA data, maps, and photo analysis to help you evaluate flood risks before you commit.
            Don’t waste time guessing. Instantly check flood risk on any property with just a click or photo upload.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-10 m-10">
            <Link href="/properties" className="w-full mx-auto ">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-4 md:px-4 py-2 md:py-4 w-full bg-black text-white hover:bg-gray-200 hover:text-indigo-700 hover:cursor-pointer"
              >
                Browse Properties <ArrowRight className="ml-2" />
              </Button>
            </Link>

            <Link href="/properties/add" className="w-full mx-auto ">
              <Button
                size="lg"
                className="text-lg px-4 md:px-4 py-2 md:py-4 w-full bg-black text-white hover:bg-gray-200 hover:text-indigo-700 hover:cursor-pointer"
              >
                Add Properties <ArrowRight className="ml-2" />
              </Button>
            </Link>


            <Link href="/analysis" className="w-full mx-auto ">
              <Button
                size="lg"
                className="text-lg px-4 md:px-4 py-2 md:py-4 w-full bg-black text-white hover:bg-gray-200 hover:text-indigo-700 hover:cursor-pointer"
              >
                Check Flood Risk with AI <ArrowRight className="ml-2" />
              </Button>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}


/**
 * Component for internal use
 * @param param0 
 * @returns 
 */
function FeatureCard({ icon, title, description }: any) {

  //==========================================================
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-2xl">
      <div className="flex justify-center mb-4">{icon}</div>

      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>

      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );

}

