
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Vision = () => {
  const handleContactClick = () => {
    toast.success("Contact request submitted! Our team will reach out to you shortly.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      
      {/* Vision Hero Section */}
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
              Our Philosophy
            </span>
            <h1 className="heading-xl mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#0EA5E9] to-[#D946EF] bg-clip-text text-transparent">
              Our Vision
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto font-light leading-relaxed">
              Moving beyond retrieval to recognition, we aim to give machines the same gift of invariant representation that humans possess.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Introduction Section */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4 flex-shrink-0 hidden md:block">
                <div className="sticky top-32">
                  <div className="h-full flex flex-col items-center">
                    <div className="w-1 h-24 bg-gradient-to-b from-transparent via-[#8B5CF6] to-transparent"></div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                    </div>
                    <div className="w-1 h-48 bg-gradient-to-b from-[#8B5CF6] via-neutral-700 to-transparent"></div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-3/4">
                <h2 className="text-3xl font-bold mb-8 text-white">The Recognition Paradigm</h2>
                <p className="text-xl font-medium mb-8 text-neutral-200 leading-relaxed">
                  Current AI systems excel at finding patterns in large volumes of data, but they struggle with the uniquely human ability to recognize individuals, objects, and scenes across varied contexts and conditions.
                </p>
                
                <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-transparent border-l-4 border-[#8B5CF6] rounded-r-2xl p-8 mb-12 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold mb-4 text-[#8B5CF6]">Our Approach</h3>
                  <p className="text-lg mb-0 text-neutral-300">
                    At EveryID, we're pioneering the shift to a <strong className="text-[#8B5CF6]">recognition paradigm</strong> — moving beyond simple pattern matching to understand invariant representations across time and space.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolution in Agent-Based AI Section */}
      <section className="container-padding py-20 bg-[#1a1a2f]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4 flex-shrink-0 hidden md:block">
                <div className="sticky top-32">
                  <div className="h-full flex flex-col items-center">
                    <div className="w-1 h-24 bg-gradient-to-b from-transparent via-[#0EA5E9] to-transparent"></div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#0EA5E9] flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                      <div className="w-2 h-2 bg-[#0EA5E9] rounded-full"></div>
                    </div>
                    <div className="w-1 h-48 bg-gradient-to-b from-[#0EA5E9] via-neutral-700 to-transparent"></div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-3/4">
                <h2 className="text-3xl font-bold mb-8 text-white">Revolution in Agent-Based AI</h2>
                <p className="text-xl font-medium mb-8 text-neutral-200 leading-relaxed">
                  The ability to recognize individuals and their actions is critical for the next generation of agent-based AI systems. Our technology enables agents to understand and interact with their environments in a more human-like way.
                </p>
                
                <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-transparent border-l-4 border-[#0EA5E9] rounded-r-2xl p-8 mb-12 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Key Benefits</h3>
                  <ul className="list-disc pl-5 text-neutral-300">
                    <li className="mb-2">Enhanced situational awareness for AI agents</li>
                    <li className="mb-2">Improved decision-making in complex scenarios</li>
                    <li>More natural and intuitive human-agent interactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recognition Benefits Section with futuristic styling */}
      <section className="container-padding py-24 bg-[#0a0a15]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Advanced Recognition Features</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Our technology delivers powerful capabilities across various domains:
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-[#8B5CF6]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Multi-Camera Tracking</h3>
                <p className="text-neutral-400">Maintain identity consistency across non-overlapping camera networks in complex environments.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#0EA5E9] to-[#D946EF] w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-[#0EA5E9]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Appearance Invariance</h3>
                <p className="text-neutral-400">Recognize individuals despite changes in clothing, lighting, or pose.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-[#D946EF]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D946EF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 4.75 7.5 4.75a12.742 12.742 0 00-3.214 2.056l-2.257-2.257a1.004 1.004 0 00-.707-.293 1.005 1.005 0 00-1.414 1.414l2.257 2.257A12.742 12.742 0 017.5 23.25a12.742 12.742 0 003.214-2.056l2.257 2.257a1.004 1.004 0 001.414.293 1.005 1.005 0 00-.707-1.707l-2.257-2.257A12.742 12.742 0 0116.5 4.75c1.746 0 3.332.727 4.5 1.503m-2.257 2.257a1.005 1.005 0 000 1.414l2.257 2.257a12.742 12.742 0 01-3.214 2.056m0 0a12.742 12.742 0 00-3.214-2.056l-2.257-2.257a1.005 1.005 0 000-1.414l2.257-2.257m0 0a12.742 12.742 0 013.214-2.056 12.742 12.742 0 003.214 2.056l2.257 2.257a1.005 1.005 0 001.414 0l-2.257-2.257m0 0c.727.665 1.503 1.832 1.503 3.25a12.742 12.742 0 01-2.056 3.214l-2.257 2.257a1.005 1.005 0 01-1.414 0l2.257-2.257A12.742 12.742 0 0116.5 18.25c0-1.418-.775-2.585-1.503-3.25m-6.747 .75v-3.25m0 3.25a12.742 12.742 0 003.214 2.056l2.257-2.257a1.005 1.005 0 000-1.414l-2.257-2.257A12.742 12.742 0 017.5 5.5c0 1.418.775 2.585 1.503 3.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Temporal Consistency</h3>
                <p className="text-neutral-400">Ensure stable identity recognition over time, even with occlusions or interruptions.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-[#8B5CF6]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Cross-Domain Recognition</h3>
                <p className="text-neutral-400">Adapt recognition models to new environments and data sources with minimal retraining.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-[#1a1a2f]/50 p-8 rounded-2xl shadow-lg border border-[#8B5CF6]/20 max-w-3xl mx-auto backdrop-blur-sm">
            <p className="text-lg border-l-4 border-[#8B5CF6] pl-6 py-2 italic text-neutral-300">
              "Our vision is to create recognition systems that understand the world the way humans do - identifying the same entity regardless of how it appears or where it's observed. This is the foundation for truly intelligent AI systems."
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#D946EF] text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              Our People
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Meet the Team</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              We are a team of experienced AI researchers and engineers dedicated to pushing the boundaries of recognition technology.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <CardContent className="p-6">
                <img src="/placeholder.svg" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">John Doe</h3>
                <p className="text-neutral-400">CEO</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <CardContent className="p-6">
                <img src="/placeholder.svg" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Jane Smith</h3>
                <p className="text-neutral-400">CTO</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
              <CardContent className="p-6">
                <img src="/placeholder.svg" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Mike Johnson</h3>
                <p className="text-neutral-400">Lead AI Researcher</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-padding py-24 bg-gradient-to-b from-[#0a0a15] to-[#1a1a2f] relative overflow-hidden">
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-[#0EA5E9]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">Pushing Transformers Beyond Recognition Limits</h2>
            
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-xl mb-6 text-neutral-300">
                Our mission is to push the boundaries of what's possible with transformer models in the domain of recognition and re-identification.
              </p>
              
              <p className="text-xl text-neutral-300">
                By developing systems that truly recognize rather than merely retrieve, we're creating AI that can understand the world more like humans do - with the ability to identify the same entity across vastly different contexts and appearances.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white p-10 rounded-2xl text-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <h3 className="text-2xl font-bold mb-6">Join us in advancing recognition technology</h3>
              <button 
                onClick={handleContactClick}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-sm"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Vision;
