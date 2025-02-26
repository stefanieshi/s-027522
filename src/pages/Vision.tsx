
import { motion } from "framer-motion";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Vision = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Hero Section - Full Width Banner */}
      <section className="relative py-32 bg-gradient-to-br from-white via-neutral-100 to-accent-purple/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-padding relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center"
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-accent-purple text-white rounded-full shadow-sm">Our Philosophy</span>
              <h1 className="heading-xl mb-6 bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">Our Vision</h1>
              <p className="text-xl md:text-2xl text-neutral-700 max-w-3xl mx-auto font-light leading-relaxed">
                A repository for the recognition of people, objects, scenes and events
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Vision Introduction - With Side Decoration */}
      <section className="container-padding py-20 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Decorative Side Element */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-32">
                <div className="h-full flex flex-col items-center">
                  <div className="w-1 h-24 bg-gradient-to-b from-transparent via-accent-purple to-transparent"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-accent-purple flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                  </div>
                  <div className="w-1 h-48 bg-gradient-to-b from-accent-purple via-neutral-300 to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-4">
              <motion.div
                {...fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-8 text-primary">The Recognition Paradigm</h2>
                <p className="text-xl font-medium mb-8 text-primary leading-relaxed">
                  Current AI agents rely heavily on retrieval of information to answer questions and perform tasks. This paradigm is fundamentally limited when it comes to making informed predictions about future events or planning complex sequences.
                </p>
                
                <div className="bg-gradient-to-r from-accent-purple/5 to-transparent border-l-4 border-accent-purple rounded-r-2xl p-8 mb-12">
                  <h3 className="text-2xl font-bold mb-4 text-accent-purple">Our Approach</h3>
                  <p className="text-lg mb-6 text-neutral-700">
                    At EveryID, we're pioneering the shift to a <strong>recognition paradigm</strong> — moving beyond simple pattern matching to understand sequences of patterns across time. This allows our systems to predict likely futures based on recognition rather than mere similarity.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Revolution in Agent-Based AI - With Cards */}
      <section className="container-padding py-24 bg-gradient-to-r from-primary/5 to-accent-purple/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-primary text-white rounded-full shadow-sm">The Future</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Revolution in Agent-Based AI</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              Moving beyond traditional paradigms to create truly intelligent systems that understand, predict, and adapt.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200"
            >
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200 flex items-center">
                <span className="inline-block w-8 h-8 bg-accent-purple text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">1</span>
                The Problem
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-accent-purple text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">A</span>
                  <div>
                    <p className="text-lg font-medium text-neutral-800">Current Limitations</p>
                    <p className="text-neutral-600">AI agents rely on retrieval of information but struggle with making truly informed predictions of future events beyond simple logical inference.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-accent-purple text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">B</span>
                  <div>
                    <p className="text-lg font-medium text-neutral-800">Planning Deficiencies</p>
                    <p className="text-neutral-600">For planning pipelines that need to be created rapidly and optimized in real-time, the current retrieval paradigm is inadequate for companies and government agencies.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200"
            >
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200 flex items-center">
                <span className="inline-block w-8 h-8 bg-accent-blue text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">2</span>
                Our Solution
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-accent-blue text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">A</span>
                  <div>
                    <p className="text-lg font-medium text-neutral-800">Recognition Over Retrieval</p>
                    <p className="text-neutral-600">We need models and LLM agents that recognize sequences of patterns across time, not just particular static patterns, enabling predictions based on likely outcomes rather than mere similarity.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-accent-blue text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">B</span>
                  <div>
                    <p className="text-lg font-medium text-neutral-800">Dynamic Planning Capabilities</p>
                    <p className="text-neutral-600">This shift enables agents to create complex plans over time and adapt them dynamically in response to new information—similar to how the human brain's anterior cingulate cortex functions.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Additional Key Points */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200"
            >
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200 flex items-center">
                <span className="inline-block w-8 h-8 bg-accent-green text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">3</span>
                The Framework
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-accent-green text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">A</span>
                  <div>
                    <p className="text-lg font-medium text-neutral-800">True Objective Function</p>
                    <p className="text-neutral-600">A real definition of good and bad across time and space requires attention and a true objective function, moving beyond the limitations of naive RAG systems.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200"
            >
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200 flex items-center">
                <span className="inline-block w-8 h-8 bg-primary text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">4</span>
                Our Mission
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-primary text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">A</span>
                  <div>
                    <p className="text-lg font-medium text-neutral-800">Beyond Person Re-ID</p>
                    <p className="text-neutral-600">While our immediate focus is solving person re-identification, our overarching mission is to advance the entire recognition paradigm for agent-based AI systems.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Recognition Benefits Section - With Visual Cards */}
      <section className="container-padding py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-accent-blue text-white rounded-full shadow-sm">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Recognition-Based Approach</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              This recognition-based approach enables AI agents to unlock powerful new capabilities:
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:translate-y-[-5px] overflow-hidden">
                <div className="h-2 bg-accent-blue w-full"></div>
                <CardContent className="pt-6 h-full flex flex-col">
                  <div className="mb-4 p-2 bg-accent-blue/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Dynamic Planning</h3>
                  <p className="text-neutral-600">Create and dynamically adjust complex plans in response to new information, allowing for adaptive strategies.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:translate-y-[-5px] overflow-hidden">
                <div className="h-2 bg-accent-green w-full"></div>
                <CardContent className="pt-6 h-full flex flex-col">
                  <div className="mb-4 p-2 bg-accent-green/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Self-Reinforcement</h3>
                  <p className="text-neutral-600">Learn from failures through self-reinforcement mechanisms, continuously improving performance.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:translate-y-[-5px] overflow-hidden">
                <div className="h-2 bg-accent-purple w-full"></div>
                <CardContent className="pt-6 h-full flex flex-col">
                  <div className="mb-4 p-2 bg-accent-purple/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">True Objective Functions</h3>
                  <p className="text-neutral-600">Develop true objective functions across time and space dimensions for more meaningful reasoning.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:translate-y-[-5px] overflow-hidden">
                <div className="h-2 bg-primary w-full"></div>
                <CardContent className="pt-6 h-full flex flex-col">
                  <div className="mb-4 p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Beyond RAG</h3>
                  <p className="text-neutral-600">Move beyond the limitations of naive retrieval-augmented generation (RAG) to true understanding.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div 
            className="mx-auto max-w-3xl" 
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
              <p className="text-lg border-l-4 border-accent-purple pl-6 py-2 italic">
                While our immediate focus is solving the fundamental challenge of person re-identification, our broader mission is to advance the entire field of recognition-based agent intelligence — bringing AI one step closer to the intuitive understanding demonstrated by the human brain.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Recognition vs Retrieval Section - With Clean Layout */}
      <section className="container-padding py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-blue/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-primary text-white rounded-full shadow-sm">Comparison</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Recognition vs. Retrieval</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              Understanding the fundamental difference between these two paradigms is key to unlocking the future of AI.
            </p>
          </motion.div>
          
          <div className="relative">
            <div className="absolute h-full w-1 bg-neutral-200 left-1/2 transform -translate-x-1/2 top-0 hidden md:block"></div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <motion.div 
                {...fadeIn}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-neutral-50 rounded-2xl p-8 shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Retrieval</h3>
                </div>
                
                <ul className="space-y-4 text-neutral-600">
                  <li className="flex items-start border-b border-neutral-200 pb-4">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Simply pulls information from a database</span>
                  </li>
                  <li className="flex items-start border-b border-neutral-200 pb-4">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Matches exact query patterns</span>
                  </li>
                  <li className="flex items-start border-b border-neutral-200 pb-4">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Limited by what has been seen before</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Struggles with novel combinations</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                {...fadeIn}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-accent-purple/5 rounded-2xl p-8 shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent-purple rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-accent-purple">Recognition</h3>
                </div>
                
                <ul className="space-y-4 text-neutral-600">
                  <li className="flex items-start border-b border-accent-purple/20 pb-4">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Identifies patterns regardless of representation</span>
                  </li>
                  <li className="flex items-start border-b border-accent-purple/20 pb-4">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Understands concepts across contexts</span>
                  </li>
                  <li className="flex items-start border-b border-accent-purple/20 pb-4">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Creates invariant representations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Enables predictive capabilities</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <motion.div 
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-md max-w-3xl mx-auto"
            >
              <blockquote className="text-lg italic relative pl-10">
                <svg className="absolute top-0 left-0 w-8 h-8 text-accent-purple/20" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                </svg>
                <p>
                  "Human intelligence excels at recognition: we can identify a person despite changes in lighting, clothing, or age. We can understand concepts across different domains and contexts. This invariant representation is what we aim to build into our AI systems."
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Future of AI Section - Enhanced Call to Action */}
      <section className="container-padding py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent-green/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-accent-green text-white rounded-full shadow-sm">Looking Forward</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">The Future of AI</h2>
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto mb-16"
            {...fadeIn}
            transition={{ duration: 0.5, delay