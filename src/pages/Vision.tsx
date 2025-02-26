
import { motion } from "framer-motion";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Vision = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Vision Hero Section */}
      <section className="container-padding relative py-32 bg-gradient-to-br from-white via-neutral-100 to-accent-purple/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-accent-purple text-white rounded-full shadow-sm">Our Philosophy</span>
            <h1 className="heading-xl mb-8 bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">Our Vision</h1>
            <p className="text-xl md:text-2xl text-neutral-700 max-w-3xl mx-auto font-light leading-relaxed">
              Moving beyond retrieval to recognition, we aim to give machines the same gift of invariant representation that humans possess.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Vision Introduction Section */}
      <section className="container-padding py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/4 flex-shrink-0 hidden md:block">
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
              
              <div className="md:w-3/4">
                <h2 className="text-3xl font-bold mb-8 text-primary">The Recognition Paradigm</h2>
                <p className="text-xl font-medium mb-8 text-primary leading-relaxed">
                  Current AI systems excel at finding patterns in large volumes of data, but they struggle with the uniquely human ability to recognize individuals, objects, and scenes across varied contexts and conditions.
                </p>
                
                <div className="bg-gradient-to-r from-accent-purple/5 to-transparent border-l-4 border-accent-purple rounded-r-2xl p-8 mb-12">
                  <h3 className="text-2xl font-bold mb-4 text-accent-purple">Our Approach</h3>
                  <p className="text-lg mb-0 text-neutral-700">
                    At EveryID, we're pioneering the shift to a <strong>recognition paradigm</strong> — moving beyond simple pattern matching to understand invariant representations across time and space. Our models can identify the same entity despite changes in appearance, context, or representation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Revolution in Agent-Based AI */}
      <section className="container-padding py-24 bg-gradient-to-r from-primary/5 to-accent-purple/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-primary text-white rounded-full shadow-sm">The Future</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Re-identification Technology</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              Our core technology addresses the fundamental challenge of re-identifying people, objects, and scenes across different contexts.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white border-neutral-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-2 bg-accent-purple w-full"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200">The Challenge</h3>
                
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 bg-accent-purple text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <p className="text-lg font-medium text-neutral-800">Complex Environments</p>
                      <p className="text-neutral-600">Re-identifying individuals across non-overlapping camera networks with different lighting, angles, and occlusions.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 bg-accent-purple text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">2</span>
                    <div>
                      <p className="text-lg font-medium text-neutral-800">Appearance Changes</p>
                      <p className="text-neutral-600">Maintaining identity consistency despite changes in clothing, accessories, and viewing conditions.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-neutral-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-2 bg-accent-blue w-full"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200">Our Solution</h3>
                
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 bg-accent-blue text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <p className="text-lg font-medium text-neutral-800">Invariant Representation</p>
                      <p className="text-neutral-600">Our models create identity representations that remain consistent despite changes in appearance or viewing conditions.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 bg-accent-blue text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">2</span>
                    <div>
                      <p className="text-lg font-medium text-neutral-800">Probabilistic Tracking</p>
                      <p className="text-neutral-600">Advanced algorithms that maintain identity tracking with confidence scores across complex environments and time periods.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white border-neutral-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-2 bg-accent-green w-full"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200">Technical Innovation</h3>
                
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 bg-accent-green text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <p className="text-lg font-medium text-neutral-800">Transformer Architecture</p>
                      <p className="text-neutral-600">Leveraging and extending transformer models specifically optimized for the re-identification task.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-neutral-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-neutral-200">Real-World Impact</h3>
                
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="inline-block w-8 h-8 bg-primary text-white rounded-full mr-4 flex-shrink-0 flex items-center justify-center font-bold text-sm">1</span>
                    <div>
                      <p className="text-lg font-medium text-neutral-800">Beyond Person Re-ID</p>
                      <p className="text-neutral-600">While our immediate focus is solving person re-identification, our technology extends to objects, scenes, and events for comprehensive recognition systems.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Recognition Benefits Section */}
      <section className="container-padding py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-accent-blue text-white rounded-full shadow-sm">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Recognition Features</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              Our technology delivers powerful capabilities across various domains:
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden">
              <div className="h-2 bg-accent-blue w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-accent-blue/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Camera Tracking</h3>
                <p className="text-neutral-600">Maintain identity consistency across non-overlapping camera networks in complex environments.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden">
              <div className="h-2 bg-accent-green w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-accent-green/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Appearance Invariance</h3>
                <p className="text-neutral-600">Identify individuals regardless of clothing changes, viewing angles, or environmental conditions.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden">
              <div className="h-2 bg-accent-purple w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-accent-purple/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Temporal Consistency</h3>
                <p className="text-neutral-600">Maintain identity tracking across time, even with significant gaps between observations.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 h-full hover:-translate-y-1 overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Occlusion Handling</h3>
                <p className="text-neutral-600">Accurately re-identify individuals in crowded scenes with partial visibility and occlusions.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 max-w-3xl mx-auto">
            <p className="text-lg border-l-4 border-accent-purple pl-6 py-2 italic">
              "Our vision is to create recognition systems that understand the world the way humans do - identifying the same entity regardless of how it appears or where it's observed. This is the foundation for truly intelligent AI systems."
            </p>
          </div>
        </div>
      </section>
      
      {/* Recognition vs Retrieval Section */}
      <section className="container-padding py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-blue/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Recognition vs. Retrieval</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-neutral-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 text-primary flex items-center">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  Retrieval
                </h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start border-b border-neutral-200 pb-3">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Finds information based on specific queries</span>
                  </li>
                  <li className="flex items-start border-b border-neutral-200 pb-3">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Matches based on similarity metrics</span>
                  </li>
                  <li className="flex items-start border-b border-neutral-200 pb-3">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Limited by exact representation matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-neutral-200 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Struggles with varied contexts or appearances</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-accent-purple/5 rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 text-accent-purple flex items-center">
                  <div className="w-10 h-10 bg-accent-purple rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Recognition
                </h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start border-b border-accent-purple/20 pb-3">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Identifies the same entity across different contexts</span>
                  </li>
                  <li className="flex items-start border-b border-accent-purple/20 pb-3">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Maintains identity despite visual changes</span>
                  </li>
                  <li className="flex items-start border-b border-accent-purple/20 pb-3">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Creates invariant representations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-accent-purple rounded-full mr-3 flex-shrink-0 mt-1"></span>
                    <span>Works across time and environmental changes</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-8 rounded-2xl mb-12 max-w-3xl mx-auto">
              <p className="text-lg italic relative pl-10">
                <svg className="absolute top-0 left-0 w-8 h-8 text-accent-purple/20" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                </svg>
                "Human intelligence excels at recognition: we can identify a person despite changes in lighting, clothing, or age. We can understand concepts across different domains and contexts. This invariant representation is what we aim to build into our AI systems."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Future of AI Section */}
      <section className="container-padding py-24 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent-green/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">Pushing Transformers Beyond Recognition Limits</h2>
            
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-xl mb-6 text-neutral-700">
                Our mission is to push the boundaries of what's possible with transformer models in the domain of recognition and re-identification.
              </p>
              
              <p className="text-xl text-neutral-700">
                By developing systems that truly recognize rather than merely retrieve, we're creating AI that can understand the world more like humans do - with the ability to identify the same entity across vastly different contexts and appearances.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary to-accent-purple text-white p-10 rounded-2xl text-center shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Join us in advancing recognition technology</h3>
              <button className="button-secondary mt-2 hover:bg-white/20 transition-colors">Contact Us</button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Vision;
