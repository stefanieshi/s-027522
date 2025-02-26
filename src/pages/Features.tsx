
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

const Features = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container-padding relative py-32 bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2f] to-[#2a1a3f] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0EA5E9]/20 rounded-full blur-[100px]"></div>
        </div>
        
        {/* Futuristic Grid Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-[#8B5CF6] text-white rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              FEATURES
            </span>
            <h1 className="heading-xl mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#0EA5E9] to-[#D946EF] bg-clip-text text-transparent">
              Powerful Recognition Technology
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto font-light leading-relaxed">
              Discover how our cutting-edge AI solutions can transform your recognition capabilities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="container-padding py-24 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              CORE TECHNOLOGY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Advanced Features</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Our platform offers groundbreaking capabilities to solve the most challenging recognition problems
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] w-full"></div>
              <CardContent className="p-8 h-full">
                <div className="mb-6 p-3 bg-[#8B5CF6]/10 rounded-2xl w-14 h-14 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Invariant Representation</h3>
                <p className="text-neutral-300 mb-6">
                  Our AI models understand the core identity of objects and people regardless of appearance changes, viewpoint, or context.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Identity permanence", "View-independent recognition", "Context resilience"].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-[#8B5CF6]/10 flex-shrink-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#8B5CF6]" />
                      </div>
                      <span className="text-neutral-400">{point}</span>
                    </li>
                  ))}
                </ul>
                <button className="text-[#8B5CF6] font-medium flex items-center gap-1 hover:gap-2 transition-all group">
                  Learn more 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#0EA5E9] to-[#D946EF] w-full"></div>
              <CardContent className="p-8 h-full">
                <div className="mb-6 p-3 bg-[#0EA5E9]/10 rounded-2xl w-14 h-14 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Multi-Camera Intelligence</h3>
                <p className="text-neutral-300 mb-6">
                  Seamlessly track and identify across non-overlapping camera systems with unparalleled accuracy and reliability.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Cross-camera tracking", "Non-overlapping views", "Temporal analysis"].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-[#0EA5E9]/10 flex-shrink-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#0EA5E9]" />
                      </div>
                      <span className="text-neutral-400">{point}</span>
                    </li>
                  ))}
                </ul>
                <button className="text-[#0EA5E9] font-medium flex items-center gap-1 hover:gap-2 transition-all group">
                  Learn more 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] w-full"></div>
              <CardContent className="p-8 h-full">
                <div className="mb-6 p-3 bg-[#D946EF]/10 rounded-2xl w-14 h-14 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D946EF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Contextual Understanding</h3>
                <p className="text-neutral-300 mb-6">
                  Our AI understands environmental context and nuanced behavioral patterns to improve recognition accuracy.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Behavioral analysis", "Environmental awareness", "Pattern recognition"].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-[#D946EF]/10 flex-shrink-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#D946EF]" />
                      </div>
                      <span className="text-neutral-400">{point}</span>
                    </li>
                  ))}
                </ul>
                <button className="text-[#D946EF] font-medium flex items-center gap-1 hover:gap-2 transition-all group">
                  Learn more 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container-padding py-24 bg-[#0a0a15]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#D946EF] text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              APPLICATIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Industry Solutions</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              See how our technology is transforming various industries
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: "Smart Cities",
                description: "Enable safer, more efficient urban environments with sophisticated recognition systems that maintain privacy and ethics.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                color: "#8B5CF6"
              },
              {
                title: "Retail Analytics",
                description: "Transform customer experience with insights into shopper behavior while preserving anonymity and ethical standards.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                color: "#0EA5E9"
              },
              {
                title: "Autonomous Systems",
                description: "Enhance self-driving vehicles and robotics with superior environmental awareness and object recognition.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D946EF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                ),
                color: "#D946EF"
              },
              {
                title: "Enterprise Security",
                description: "Elevate physical security systems with advanced recognition that works across varying conditions and environments.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                color: "#8B5CF6"
              }
            ].map((useCase, index) => (
              <Card key={useCase.title} className="bg-[#1a1a2f]/50 border-white/5 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
                <CardContent className="p-8 h-full">
                  <div className="flex items-start gap-6">
                    <div className="mb-6 p-3 bg-white/5 rounded-2xl w-14 h-14 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${useCase.color}10` }}>
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{useCase.title}</h3>
                      <p className="text-neutral-300 mb-4">{useCase.description}</p>
                      <button className="text-white/70 font-medium flex items-center gap-1 hover:gap-2 transition-all group hover:text-white">
                        Explore solution
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-padding py-24 bg-gradient-to-b from-[#1a1a2f] to-[#0a0a15] relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#8B5CF6]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#0EA5E9]/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to transform your recognition capabilities?</h2>
            <p className="text-xl text-neutral-300 mb-10 max-w-3xl mx-auto">
              Experience the future of AI recognition technology with a personalized demo tailored to your needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vision" className="button-primary py-4 px-8 text-lg shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                Learn About Our Vision
              </Link>
              <button className="button-secondary py-4 px-8 text-lg shadow-[0_0_25px_rgba(14,165,233,0.3)]">
                Request Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
