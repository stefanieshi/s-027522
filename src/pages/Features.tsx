
import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import FeaturesSection from "@/components/landing/Features";
import TrustedBy from "@/components/landing/TrustedBy";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const Features = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      <Hero />
      
      {/* Fundamental Challenges & Solutions Section */}
      <section className="container-padding py-20 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Fundamental Challenges Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#8B5CF6] text-white rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  The Problem Space
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Fundamental Challenges</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Person Re-Identification presents unique technical hurdles that we're addressing with innovative approaches.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Intra-class vs Inter-class Complexity</h3>
                  <p className="text-gray-300">
                    Person ReID is an intra-class problem (distinguishing between instances of the same class) which is inherently more difficult than inter-class problems like object detection.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Appearance Variability</h3>
                  <p className="text-gray-300">
                    People change appearance across time and cameras (clothing, pose, lighting, viewpoint).
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Occlusion and Partial Views</h3>
                  <p className="text-gray-300">
                    Often only partial information is available in crowded scenes.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Camera Variations</h3>
                  <p className="text-gray-300">
                    Different cameras have different characteristics (resolution, color balance, angle).
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Temporal Consistency</h3>
                  <p className="text-gray-300">
                    Maintaining identity across time requires more than frame-by-frame matching.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#8B5CF6]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Scalability</h3>
                  <p className="text-gray-300">
                    Systems must handle thousands of identities efficiently.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Proposed Solutions Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-8">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  Our Approach
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Proposed Solutions</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our research team is developing cutting-edge approaches to overcome these challenges.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Advanced Transformer Architectures</h3>
                  <p className="text-gray-300">
                    Utilizing state-of-the-art vision transformers trained on large datasets to extract robust features.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Multi-modal Fusion</h3>
                  <p className="text-gray-300">
                    Combining appearance, temporal, and contextual information for more reliable identification.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Temporal Modeling</h3>
                  <p className="text-gray-300">
                    Incorporating time as a dimension in the recognition process rather than treating frames independently.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Scene Context Integration</h3>
                  <p className="text-gray-300">
                    Using scene understanding to improve person ReID by constraining the search space.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Self-supervised Learning</h3>
                  <p className="text-gray-300">
                    Leveraging unlabeled data to improve generalization through techniques like DINO grounding.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Clustering and Reranking</h3>
                  <p className="text-gray-300">
                    Clustering similar tracks and reranking them to improve the essential mAP metric.
                  </p>
                </div>
                
                <div className="bg-[#1a1a2f]/50 rounded-xl p-6 border border-[#0EA5E9]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Hierarchical Recognition</h3>
                  <p className="text-gray-300">
                    Implementing a multi-stage approach that progressively refines identification.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      <TrustedBy />
      <Footer />
    </div>
  );
};

export default Features;
