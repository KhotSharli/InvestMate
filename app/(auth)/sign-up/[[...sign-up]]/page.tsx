import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2, PieChart, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";

const SignUpPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-white to-gray-200">
      {/* Left section for sign-up */}
      <div className="h-full flex-col items-center justify-center px-8 bg-[#daede6] lg:flex lg:px-16">
        <div className="space-y-6 pt-16 text-center">
          <Image
            src="/logo.svg"
            alt="InvestMate logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
            style={{ filter: "brightness(0) invert(1)" }} // Adjust for white logo
          />
          <h1 className="text-4xl font-extrabold text-[#4bf2b5] tracking-tight">
            Join InvestMate
          </h1>
          <p className="text-lg text-gray-600">
            Create an account to access your personalized financial dashboard
            and expert advice.
          </p>
        </div>

        <div className="mt-10 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4 border border-[#4bf2b5]">
          <ClerkLoaded>
            <SignUp path="/sign-up" />
          </ClerkLoaded>

          <ClerkLoading>
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#4bf2b5]" />
            </div>
          </ClerkLoading>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          By signing up, you agree to our{" "}
          <a href="/terms" className="underline hover:text-[#4bf2b5]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-[#4bf2b5]">
            Privacy Policy
          </a>
          .
        </div>
      </div>

      {/* Right section for visual highlight */}
      <div className="hidden lg:flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#4bf2b5] to-[#34d2a0] text-white px-8 py-12">
        <h2 className="text-3xl font-bold mb-6">
          Your Path to Financial Success
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<PieChart className="h-10 w-10 text-yellow-400" />}
            title="Portfolio Analysis"
            description="Get insights into your investment portfolio"
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-green-400" />}
            title="Market Trends"
            description="Stay updated with the latest market trends"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-blue-400" />}
            title="Secure Planning"
            description="Plan your financial future with confidence"
          />
        </div>
      </div>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center space-y-3 p-6 bg-white bg-opacity-20 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:bg-opacity-30">
      <div className="p-2 rounded-full bg-white bg-opacity-10">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-200">{description}</p>
    </div>
  );
}

export default SignUpPage;
