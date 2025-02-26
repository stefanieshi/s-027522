
import { motion } from "framer-motion";
import { Factory, Users, Shield, Building2, BarChart3, Briefcase, Tv, Video, Globe, Brain } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const IndustryApplications = () => {
  const handleContactClick = () => {
    toast.success("Contact request submitted! Our team will reach out to you shortly.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      
      {/* Industry Applications Hero Section */}
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
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              Enterprise Solutions
            </span>
            <h1 className="heading-xl mb-8 bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
              Industry Applications
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto font-light leading-relaxed">
              Our recognition technology addresses critical challenges across diverse industries, enabling intelligent identification in complex environments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industry Sectors Overview */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#8B5CF6] text-white rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              Market Segments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Key Industry Applications</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Our advanced recognition technology delivers transformative solutions across these critical sectors
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* TV Post Production Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                    alt="TV Post Production" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#0EA5E9] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#0EA5E9]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Tv className="h-8 w-8 text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">TV Post Production</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Transform your post-production workflows with intelligent content recognition that dramatically reduces manual effort while enhancing creative capabilities.
                    </p>
                    
                    <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-transparent border-l-4 border-[#0EA5E9] rounded-r-xl p-4 mt-6">
                      <h4 className="font-semibold text-white mb-2">Key Capabilities</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Automatic logging and syncing across multiple footage sources</li>
                        <li>Instant searchability based on people, scenes, and concepts</li>
                        <li>Knowledge graph generation for content clusters</li>
                        <li>Context-aware tracking with probabilistic likelihood</li>
                        <li>Real-time indexing of large productions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Surveillance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                    alt="Surveillance" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#8B5CF6] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#8B5CF6]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Video className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Surveillance</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Our technology empowers security professionals with advanced person re-identification across complex camera networks, maintaining identity consistency even in challenging conditions.
                    </p>
                    
                    <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-transparent border-l-4 border-[#8B5CF6] rounded-r-xl p-4 mt-6">
                      <h4 className="font-semibold text-white mb-2">Key Capabilities</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Track individuals across non-overlapping camera networks</li>
                        <li>Maintain identity consistency despite appearance changes</li>
                        <li>Handle crowded scenes and occlusions</li>
                        <li>Process real-time video streams efficiently</li>
                        <li>Scale to large camera networks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Government Intelligence Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                    alt="Government Intelligence" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#D946EF] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#D946EF]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Globe className="h-8 w-8 text-[#D946EF]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Government Intelligence</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Enhance intelligence capabilities with our advanced recognition platform that efficiently processes diverse data sources and integrates with existing systems.
                    </p>
                    
                    <div className="bg-gradient-to-r from-[#D946EF]/10 to-transparent border-l-4 border-[#D946EF] rounded-r-xl p-4 mt-6">
                      <h4 className="font-semibold text-white mb-2">Key Capabilities</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Rapid processing of surveillance footage</li>
                        <li>Cross-referencing across multiple data sources</li>
                        <li>Temporal analysis of movement patterns</li>
                        <li>Integration with existing intelligence systems</li>
                        <li>Handling of low-quality imagery</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Agent-Based AI Frameworks Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                    alt="Agent-Based AI Frameworks" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#0EA5E9] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#0EA5E9]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Agent-Based AI Frameworks</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Our next-generation AI agent frameworks move beyond simple retrieval to sophisticated recognition and prediction capabilities for truly adaptive systems.
                    </p>
                    
                    <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-transparent border-l-4 border-[#0EA5E9] rounded-r-xl p-4 mt-6">
                      <h4 className="font-semibold text-white mb-2">Key Capabilities</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Moving from retrieval to recognition paradigms</li>
                        <li>Enabling prediction of future events through pattern recognition</li>
                        <li>Building agents that can adapt plans dynamically</li>
                        <li>Creating self-reinforcement from failure</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container-padding py-20 bg-[#0a0a15]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                Enterprise Integration
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Seamless Implementation</h2>
              <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
                Our platform integrates effortlessly with your existing infrastructure, minimizing disruption while maximizing value.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#0EA5E9]/20 p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0EA5E9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">API-First Architecture</h3>
                    <p className="text-neutral-400">Flexible REST APIs and SDK options for seamless integration</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#0EA5E9]/20 p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0EA5E9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Deployment Flexibility</h3>
                    <p className="text-neutral-400">On-premises, cloud, or hybrid options to match your security requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#0EA5E9]/20 p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0EA5E9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Enterprise-Grade Security</h3>
                    <p className="text-neutral-400">End-to-end encryption and comprehensive access controls</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0EA5E9]/20 via-[#8B5CF6]/20 to-[#D946EF]/20 blur-lg opacity-70 rounded-2xl"></div>
              <div className="glass-panel rounded-xl p-6 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-white/10">
                    <BarChart3 className="h-8 w-8 text-[#0EA5E9] mb-3" />
                    <h3 className="text-white font-medium mb-2">Analytics Integration</h3>
                    <p className="text-sm text-neutral-400">Integrate with your existing analytics platforms</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-white/10">
                    <Briefcase className="h-8 w-8 text-[#8B5CF6] mb-3" />
                    <h3 className="text-white font-medium mb-2">Business Systems</h3>
                    <p className="text-sm text-neutral-400">Seamless connection with ERP and CRM platforms</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-white/10">
                    <Users className="h-8 w-8 text-[#D946EF] mb-3" />
                    <h3 className="text-white font-medium mb-2">Identity Management</h3>
                    <p className="text-sm text-neutral-400">Works with your existing IAM solutions</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm border border-white/10">
                    <Factory className="h-8 w-8 text-[#0EA5E9] mb-3" />
                    <h3 className="text-white font-medium mb-2">IoT Ecosystems</h3>
                    <p className="text-sm text-neutral-400">Connect with sensors and industrial IoT platforms</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#D946EF] text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Case Studies</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              See how our technology has transformed operations across industries
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {/* Case Study 1 - TV Production */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full mb-4">TV Post Production</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Major Broadcasting Network</h3>
                    <p className="text-neutral-300 mb-6">
                      Deployed our recognition platform across their post-production department, dramatically improving content discovery and processing speeds.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="text-[#8B5CF6] font-semibold">82%</div>
                        <div className="text-neutral-400 text-sm">Reduction in footage logging time</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[#8B5CF6] font-semibold">65%</div>
                        <div className="text-neutral-400 text-sm">Faster content discovery</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[#8B5CF6] font-semibold">$3.8M</div>
                        <div className="text-neutral-400 text-sm">Annual operational savings</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#0EA5E9]/20 flex items-center justify-center p-8">
                    <Tv className="h-24 w-24 text-white/20" />
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Case Study 2 - Surveillance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gradient-to-br from-[#0EA5E9]/20 to-[#D946EF]/20 flex items-center justify-center p-8 order-last md:order-first">
                    <Video className="h-24 w-24 text-white/20" />
                  </div>
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#0EA5E9]/20 text-[#0EA5E9] rounded-full mb-4">Surveillance</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Metropolitan Transit Authority</h3>
                    <p className="text-neutral-300 mb-6">
                      Implemented our recognition system across 200+ camera networks to enhance security operations and incident response.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="text-[#0EA5E9] font-semibold">94%</div>
                        <div className="text-neutral-400 text-sm">Identity maintenance across camera networks</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[#0EA5E9] font-semibold">76%</div>
                        <div className="text-neutral-400 text-sm">Faster incident resolution</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[#0EA5E9] font-semibold">24/7</div>
                        <div className="text-neutral-400 text-sm">Real-time processing with minimal latency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <button className="button-primary" onClick={handleContactClick}>
              Request a Case Study
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-padding py-24 bg-gradient-to-b from-[#0a0a15] to-[#1a1a2f] relative overflow-hidden">
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-[#0EA5E9]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] bg-clip-text text-transparent">
              Ready to Transform Your Industry?
            </h2>
            
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-xl mb-8 text-neutral-300">
                Discover how our recognition technology can address your industry's unique challenges and unlock new possibilities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="button-primary">
                  Schedule a Demo
                </button>
                <button 
                  onClick={handleContactClick}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-sm"
                >
                  Contact Our Team
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndustryApplications;
