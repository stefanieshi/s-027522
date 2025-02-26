
import { motion } from "framer-motion";
import { Lightbulb, Rocket, Zap, BarChart3, Network, PieChart, Brain, Eye, Video, Database, Clock } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const FutureDirections = () => {
  const handleSubscribeClick = () => {
    toast.success("Thanks for subscribing! You'll receive updates on our technology roadmap.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      
      {/* Future Directions Hero Section */}
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
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-[#D946EF] text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              Innovation Roadmap
            </span>
            <h1 className="heading-xl mb-8 bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
              Future Directions
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto font-light leading-relaxed">
              Exploring the next frontiers of recognition technology and the transformative potential for industries worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Local Vision LLMs Section */}
      <section className="container-padding py-20 bg-[#0a0a15]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              Next-Gen Vision Systems
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Leveraging Local Vision LLMs</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Exploring non-API-based vision language models like LLAVA for advanced scene analysis
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="h-48 md:h-80 relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485" 
                  alt="AI Vision Analysis" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/80 via-transparent to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-neutral-300 leading-relaxed mb-6">
                We aim to explore the use of local, non-API-based vision LLMs like LLAVA for scene analysis. This approach eliminates the need for constant cloud connectivity while maintaining powerful analytical capabilities.
              </p>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                    <Video className="h-5 w-5 mr-3 text-[#0EA5E9]" />
                    Dynamic Scenes
                  </h3>
                  <p className="text-neutral-300">
                    For moving cameras or edited footage, snapshots can be captured intermittently during scene transitions, providing key contextual frames for analysis.
                  </p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                    <Eye className="h-5 w-5 mr-3 text-[#0EA5E9]" />
                    Static Scenes
                  </h3>
                  <p className="text-neutral-300">
                    For fixed security cameras, the focus will be on recording "salient events" in real-time, determined by the vision LLM. This process can be enhanced with open-set models that trigger snapshots based on specific thresholds.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-2 bg-[#8B5CF6] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#8B5CF6]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Database className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Searchable Video Indexing</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      This approach enables natural language queries across vast video datasets, allowing users to find people, objects, and events without traditional tagging systems.
                    </p>
                    
                    <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-transparent border-l-4 border-[#8B5CF6] rounded-r-xl p-4 mt-6">
                      <h4 className="font-semibold text-white mb-2">Key Advantages</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Semantic understanding of video content</li>
                        <li>Natural language search capabilities</li>
                        <li>Contextual awareness of objects and actions</li>
                        <li>Minimal manual tagging required</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-2 bg-[#0EA5E9] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#0EA5E9]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Eye className="h-8 w-8 text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Security Applications</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      These technologies offer lightweight, local solutions for security companies, potentially disrupting the market with cost-effective alternatives to cloud-based systems.
                    </p>
                    
                    <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-transparent border-l-4 border-[#0EA5E9] rounded-r-xl p-4 mt-6">
                      <h4 className="font-semibold text-white mb-2">Market Impact</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Reduced dependency on cloud infrastructure</li>
                        <li>Lower operational costs for security providers</li>
                        <li>Enhanced privacy through local processing</li>
                        <li>Faster response time for critical events</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Research Areas Section */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#D946EF] text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              Research Focus
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Key Research Areas</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Our team is focused on these critical research challenges to make local vision LLMs viable for real-world applications
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {/* Speed and Latency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  <div>
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full mb-4">Research Challenge 1</div>
                    <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
                      <Clock className="mr-2 h-6 w-6 text-[#8B5CF6]" />
                      Speed and Latency
                    </h3>
                    <p className="text-neutral-300 mb-6">
                      We're investigating whether local vision LLMs like LLAVA can operate efficiently in real-time scenarios while maintaining high performance.
                    </p>
                    
                    <div className="space-y-3 mt-4">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Performance Metrics</h4>
                        <ul className="list-disc pl-5 text-neutral-300 space-y-1">
                          <li>Processing speed per frame with MPS optimization</li>
                          <li>Performance on A100 and H100 GPUs</li>
                          <li>Benchmarking over an hour of edited footage</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Snapshot Frequency Optimization</h4>
                        <p className="text-neutral-300">
                          Finding the optimal balance between sparse snapshots for speed and dense coverage for detail capture in high-pressure scenarios.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f" 
                        alt="Speed and Latency Research" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]/80"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Data Model Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  <div className="flex items-center justify-center order-last md:order-first">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1542903660-eedba2cda473" 
                        alt="Data Model Research" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]/80"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#0EA5E9]/20 text-[#0EA5E9] rounded-full mb-4">Research Challenge 2</div>
                    <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
                      <Database className="mr-2 h-6 w-6 text-[#0EA5E9]" />
                      Data Model Compliance
                    </h3>
                    <p className="text-neutral-300 mb-6">
                      Our research explores whether LLAVA can condense its detailed responses into structured outputs that conform to specific data models.
                    </p>
                    
                    <div className="space-y-3 mt-4">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Structured Output Development</h4>
                        <p className="text-neutral-300">
                          Converting complex analyses into concise formats:
                        </p>
                        <ul className="list-disc pl-5 text-neutral-300 mt-2 space-y-1">
                          <li>3-word summaries of scene content</li>
                          <li>Single-word classifications based on predefined Enum values</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Hybrid Approach Benefits</h4>
                        <p className="text-neutral-300">
                          This combines LLAVA's generality with the determinism of custom deep learning models, offering both flexibility and reliability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Person Re-Identification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  <div>
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#D946EF]/20 text-[#D946EF] rounded-full mb-4">Research Challenge 3</div>
                    <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
                      <Eye className="mr-2 h-6 w-6 text-[#D946EF]" />
                      Enhancing Person Re-Identification
                    </h3>
                    <p className="text-neutral-300 mb-6">
                      While not essential, LLAVA could assist in narrowing predictions for Person ReID by leveraging its rich contextual understanding and metadata capabilities.
                    </p>
                    
                    <div className="space-y-3 mt-4">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Constraint-Based Identification</h4>
                        <p className="text-neutral-300">
                          Isolating who an individual cannot be, improving the mean Average Precision (mAP) metric through elimination rather than direct matching.
                        </p>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Appearance Change Handling</h4>
                        <p className="text-neutral-300">
                          Addressing challenges like appearance changes across time in TV shows or long-term CCTV footage through contextual understanding.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0" 
                        alt="Person Re-Identification Research" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]/80"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Roadmap Section */}
      <section className="container-padding py-20 bg-[#0a0a15]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              Technology Roadmap
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Innovation Pipeline</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              We're continually pushing the boundaries of what's possible with recognition technology
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Advanced Neural Networks Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                    alt="Advanced Neural Networks" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#0EA5E9] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#0EA5E9]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-[#0EA5E9]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Advanced Neural Networks</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Our next-generation neural architectures will dramatically improve recognition performance across extremely challenging conditions, with a focus on minimal training data requirements.
                    </p>
                    
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#0EA5E9]"></div>
                        <div className="text-sm font-medium text-white">Q3 2023: Prototype completion</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#0EA5E9]"></div>
                        <div className="text-sm font-medium text-white">Q1 2024: Limited alpha release</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#0EA5E9]"></div>
                        <div className="text-sm font-medium text-white">Q3 2024: General availability</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Multimodal Recognition Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                    alt="Multimodal Recognition" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#8B5CF6] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#8B5CF6]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Network className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Multimodal Recognition</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Combining visual, audio, and contextual data streams to enable more robust identification in complex real-world settings where single-modality systems often struggle.
                    </p>
                    
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
                        <div className="text-sm font-medium text-white">Q4 2023: Research paper publication</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
                        <div className="text-sm font-medium text-white">Q2 2024: Beta testing phase</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
                        <div className="text-sm font-medium text-white">Q4 2024: Production release</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Edge Deployment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full bg-[#1a1a2f]/50 border-[#D946EF]/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
                    alt="Edge Deployment" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2f]"></div>
                </div>
                <div className="h-2 bg-[#D946EF] w-full"></div>
                <CardContent className="p-8">
                  <div className="mb-6 p-3 bg-[#D946EF]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-[#D946EF]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Edge Deployment</h3>
                  
                  <div className="space-y-4 text-neutral-300">
                    <p className="leading-relaxed">
                      Ultra-efficient deployments that bring our advanced recognition capabilities to resource-constrained environments, from IoT devices to mobile platforms.
                    </p>
                    
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#D946EF]"></div>
                        <div className="text-sm font-medium text-white">Q2 2023: First device integrations</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#D946EF]"></div>
                        <div className="text-sm font-medium text-white">Q3 2023: SDK for developers</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#D946EF]"></div>
                        <div className="text-sm font-medium text-white">Q1 2024: Expanded device support</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Future Applications Section */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              Future Horizons
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Emerging Applications</h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              As our technology advances, entirely new use cases become possible
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {/* Future Application 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#8B5CF6]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  <div>
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full mb-4">Healthcare</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Augmented Diagnostics</h3>
                    <p className="text-neutral-300 mb-6">
                      Using recognition technology to analyze medical imagery and patient data together, assisting healthcare professionals in detecting patterns that could indicate health conditions earlier than traditional methods.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-white/5 rounded-md text-sm text-neutral-200">Pattern Recognition</div>
                      <div className="px-3 py-1 bg-white/5 rounded-md text-sm text-neutral-200">Early Detection</div>
                      <div className="px-3 py-1 bg-white/5 rounded-md text-sm text-neutral-200">Decision Support</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-full h-full max-h-60">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-xl"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white/10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.5 14.5L5 18H19L14.5 12L11 16.5L8.5 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="21" cy="3" r="1" stroke="currentColor" strokeWidth="2"/>
                          <path d="M21 7V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Future Application 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-[#1a1a2f]/50 border-[#0EA5E9]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  <div className="flex items-center justify-center order-last md:order-first">
                    <div className="relative w-full h-full max-h-60">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D946EF]/20 to-[#0EA5E9]/20 rounded-xl"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white/10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="2" y="4" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                          <rect x="18" y="4" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                          <rect x="2" y="16" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                          <rect x="18" y="16" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-[#0EA5E9]/20 text-[#0EA5E9] rounded-full mb-4">Smart Cities</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Adaptive Urban Systems</h3>
                    <p className="text-neutral-300 mb-6">
                      Recognition technology that helps urban environments adapt to changing conditions in real-time, from traffic flow optimization to emergency response coordination.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-white/5 rounded-md text-sm text-neutral-200">Traffic Optimization</div>
                      <div className="px-3 py-1 bg-white/5 rounded-md text-sm text-neutral-200">Energy Efficiency</div>
                      <div className="px-3 py-1 bg-white/5 rounded-md text-sm text-neutral-200">Safety</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <button className="button-primary" onClick={handleSubscribeClick}>
              Subscribe to Research Updates
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
              Be Part of the Future
            </h2>
            
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-xl mb-8 text-neutral-300">
                Join our community of partners and early adopters to influence the direction of our technology and gain early access to breakthrough capabilities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="button-primary">
                  Join Early Access Program
                </button>
                <button 
                  onClick={handleSubscribeClick}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-sm"
                >
                  Partner With Us
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

export default FutureDirections;
