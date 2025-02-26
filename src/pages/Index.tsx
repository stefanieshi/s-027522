
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
      
      <Footer />
    </div>
  );
};

export default Index;
