
import { motion } from "framer-motion";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Vision = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Vision Hero Section */}
      <section className="container-padding py-32 bg-gradient-to-b from-white to-neutral-100">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-accent-purple text-white rounded-full">Our Philosophy</span>
            <h1 className="heading-xl mb-6 bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">Our Vision</h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              A repository for the recognition of people, objects, scenes and events
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Vision Introduction Section */}
      <section className="container-padding py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl font-medium mb-8 text-primary leading-relaxed">
              Current AI agents rely heavily on retrieval of information to answer questions and perform tasks. This paradigm is fundamentally limited when it comes to making informed predictions about future events or planning complex sequences.
            </p>
            
            <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4 text-accent-purple">Our Approach</h3>
              <p className="text-lg mb-6">
                At EveryID, we're pioneering the shift to a <strong>recognition paradigm</strong> — moving beyond simple pattern matching to understand sequences of patterns across time. This allows our systems to predict likely futures based on recognition rather than mere similarity.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Recognition Benefits Section */}
      <section className="container-padding py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Recognition-Based Approach</h2>
            <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
              This recognition-based approach enables AI agents to unlock powerful new capabilities:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-2 bg-accent-blue w-full"></div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Dynamic Planning</h3>
                  <p className="text-neutral-600">Create and dynamically adjust complex plans in response to new information, allowing for adaptive strategies.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-2 bg-accent-green w-full"></div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Self-Reinforcement</h3>
                  <p className="text-neutral-600">Learn from failures through self-reinforcement mechanisms, continuously improving performance.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-2 bg-accent-purple w-full"></div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">True Objective Functions</h3>
                  <p className="text-neutral-600">Develop true objective functions across time and space dimensions for more meaningful reasoning.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-2 bg-primary w-full"></div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Beyond RAG</h3>
                  <p className="text-neutral-600">Move beyond the limitations of naive retrieval-augmented generation (RAG) to true understanding.</p>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-lg mb-10 border-l-4 border-accent-purple pl-6 py-2">
              While our immediate focus is solving the fundamental challenge of person re-identification, our broader mission is to advance the entire field of recognition-based agent intelligence — bringing AI one step closer to the intuitive understanding demonstrated by the human brain.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Recognition vs Retrieval Section */}
      <section className="container-padding py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-blue/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Recognition vs. Retrieval</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Retrieval</h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Simply pulls information from a database</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Matches exact query patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Limited by what has been seen before</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Struggles with novel combinations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-accent-purple">Recognition</h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Identifies patterns regardless of representation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Understands concepts across contexts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Creates invariant representations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Enables predictive capabilities</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-8 rounded-2xl mb-12">
              <p className="text-lg italic">
                "Human intelligence excels at recognition: we can identify a person despite changes in lighting, clothing, or age. We can understand concepts across different domains and contexts. This invariant representation is what we aim to build into our AI systems."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Future of AI Section */}
      <section className="container-padding py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">The Future of AI</h2>
            
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-xl mb-6 text-neutral-700">
                We believe that the next breakthrough in artificial intelligence will come not from larger models or more data, but from a fundamentally different approach to how machines understand and interact with the world.
              </p>
              
              <p className="text-xl text-neutral-700">
                By building systems that truly recognize rather than merely retrieve, we're creating the foundation for AI that can reason, plan, and adapt in ways that current systems cannot. This is not just an incremental improvement — it's a paradigm shift that will unlock entirely new capabilities for artificial intelligence.
              </p>
            </div>
            
            <div className="bg-primary text-white p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-4">Join us in pioneering the recognition paradigm</h3>
              <button className="button-secondary mt-2">Get Started Today</button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Vision;
