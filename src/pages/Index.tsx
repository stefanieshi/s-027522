
import { motion } from "framer-motion";
import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      <Hero />
      <TrustedBy />
      <Features />
      
      {/* Applications Section */}
      <section className="container-padding py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-lg mb-4">Applications</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              Our recognition technology is transforming industries by enabling advanced pattern recognition across time and space.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>TV Post Production</CardTitle>
                  <CardDescription>Revolutionizing content management workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Automatic logging and syncing across multiple footage sources</li>
                    <li>• Instant searchability based on people, scenes, and concepts</li>
                    <li>• Knowledge graph generation for content clusters</li>
                    <li>• Context-aware tracking with probabilistic likelihood</li>
                    <li>• Real-time indexing of large productions</li>
                    <li>• Automated organization by cast, locations, and scenes</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Surveillance</CardTitle>
                  <CardDescription>Robust identification across challenging conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Track individuals across non-overlapping camera networks</li>
                    <li>• Maintain identity consistency despite appearance changes</li>
                    <li>• Handle crowded scenes and occlusions effectively</li>
                    <li>• Process real-time video streams efficiently</li>
                    <li>• Scale to large camera networks without degradation</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Intelligence & Defense</CardTitle>
                  <CardDescription>Advanced visual analytics for critical operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Rapid processing of surveillance footage and imagery</li>
                    <li>• Cross-referencing across multiple data sources</li>
                    <li>• Temporal analysis of movement patterns</li>
                    <li>• Integration with existing intelligence systems</li>
                    <li>• Secure, auditable tracking of identifications</li>
                    <li>• Processing of low-quality or degraded imagery</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Agent AI Frameworks</CardTitle>
                  <CardDescription>Moving beyond retrieval to true recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Recognition of temporal pattern sequences</li>
                    <li>• Predictive agents based on recognition paradigms</li>
                    <li>• Dynamic planning with real-time adaptation</li>
                    <li>• Self-reinforcement from failure analysis</li>
                    <li>• True objective functions across time and space</li>
                    <li>• Future-facing insights beyond naive retrieval</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="container-padding py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-lg mb-4">Our Vision</h2>
            <p className="text-neutral-600">
              EveryID: a repository for the recognition of people, objects, scenes and events
            </p>
          </motion.div>
          
          <motion.div
            className="prose prose-neutral max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg mb-6">
              Current AI agents rely heavily on retrieval of information to answer questions and perform tasks. This paradigm is fundamentally limited when it comes to making informed predictions about future events or planning complex sequences.
            </p>
            <p className="text-lg mb-6">
              At EveryID, we're pioneering the shift to a <strong>recognition paradigm</strong> — moving beyond simple pattern matching to understand sequences of patterns across time. This allows our systems to predict likely futures based on recognition rather than mere similarity.
            </p>
            <p className="text-lg mb-6">
              This recognition-based approach enables AI agents to:
            </p>
            <ul className="space-y-2 mb-6">
              <li>• Create and dynamically adjust complex plans in response to new information</li>
              <li>• Learn from failures through self-reinforcement mechanisms</li>
              <li>• Develop true objective functions across time and space dimensions</li>
              <li>• Move beyond the limitations of naive retrieval-augmented generation (RAG)</li>
            </ul>
            <p className="text-lg">
              While our immediate focus is solving the fundamental challenge of person re-identification, our broader mission is to advance the entire field of recognition-based agent intelligence — bringing AI one step closer to the intuitive understanding demonstrated by the human brain.
            </p>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
