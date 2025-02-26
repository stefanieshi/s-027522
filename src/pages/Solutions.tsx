
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Solutions = () => {
  const challengesList = [
    {
      title: "Intra-class vs Inter-class Complexity",
      description: "Person ReID is an intra-class problem (distinguishing between instances of the same class) which is inherently more difficult than inter-class problems like object detection.",
      color: "#8B5CF6"
    },
    {
      title: "Appearance Variability",
      description: "People change appearance across time and cameras (clothing, pose, lighting, viewpoint).",
      color: "#0EA5E9"
    },
    {
      title: "Occlusion and Partial Views",
      description: "Often only partial information is available in crowded scenes.",
      color: "#10B981"
    },
    {
      title: "Camera Variations",
      description: "Different cameras have different characteristics (resolution, color balance, angle).",
      color: "#F59E0B"
    },
    {
      title: "Temporal Consistency",
      description: "Maintaining identity across time requires more than frame-by-frame matching.",
      color: "#EC4899"
    },
    {
      title: "Scalability",
      description: "Systems must handle thousands of identities efficiently.",
      color: "#6366F1"
    }
  ];

  const solutionsList = [
    {
      title: "Advanced Transformer Architectures",
      description: "Utilizing state-of-the-art vision transformers trained on large datasets to extract robust features.",
      details: [
        "Attention mechanisms for appearance-invariant features",
        "Multi-scale feature fusion for comprehensive representation",
        "Optimized for high throughput and accuracy"
      ],
      color: "#8B5CF6"
    },
    {
      title: "Multi-modal Fusion",
      description: "Combining appearance, temporal, and contextual information for more reliable identification.",
      details: [
        "Integration of visual, spatial, and temporal data",
        "Weighted feature fusion for optimal performance",
        "Dynamic adjustment based on confidence scores"
      ],
      color: "#0EA5E9"
    },
    {
      title: "Temporal Modeling",
      description: "Incorporating time as a dimension in the recognition process rather than treating frames independently.",
      details: [
        "Sequence modeling for trajectory consistency",
        "Time-aware feature extraction",
        "Long-term dependency modeling"
      ],
      color: "#10B981"
    },
    {
      title: "Scene Context Integration",
      description: "Using scene understanding to improve person ReID by constraining the search space.",
      details: [
        "Environment-aware recognition algorithms",
        "Spatial relationship mapping",
        "Context-based re-ranking of candidates"
      ],
      color: "#F59E0B"
    },
    {
      title: "Self-supervised Learning",
      description: "Leveraging unlabeled data to improve generalization through techniques like DINO grounding.",
      details: [
        "Contrastive learning for identity embeddings",
        "Unsupervised domain adaptation",
        "Knowledge distillation from large models"
      ],
      color: "#EC4899"
    },
    {
      title: "Clustering and Reranking",
      description: "Clustering similar tracks and reranking them to improve the essential mAP metric.",
      details: [
        "Hierarchical clustering for related identities",
        "Distance metric learning for precise similarity",
        "Post-processing optimization for improved accuracy"
      ],
      color: "#6366F1"
    },
    {
      title: "Hierarchical Recognition",
      description: "Implementing a multi-stage approach that progressively refines identification.",
      details: [
        "Coarse-to-fine identity matching",
        "Cascaded verification stages",
        "Confidence-based decision making"
      ],
      color: "#14B8A6"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2f]/50 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-full">
              INNOVATIVE APPROACHES
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Proposed Solutions</h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Discover how our cutting-edge techniques are addressing the fundamental challenges
              of person re-identification across diverse environments and conditions.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/future-directions" className="button-secondary">
                Future Directions
              </Link>
              <Link to="/industry-applications" className="button-primary">
                Industry Applications
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Challenges Section */}
      <section className="py-20 bg-[#0f0f1a]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#8B5CF6] text-white rounded-full">
              THE PROBLEM SPACE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Fundamental Challenges</h2>
            <p className="text-lg text-gray-300">
              Person Re-Identification presents unique technical hurdles that we're addressing with innovative approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challengesList.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-[#1a1a2f]/50 border border-white/10 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-2" style={{ backgroundColor: challenge.color }}></div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">{challenge.title}</h3>
                    <p className="text-gray-300">{challenge.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Solutions List Section */}
      <section className="py-20 bg-[#0c0c14]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#0EA5E9] text-white rounded-full">
              OUR APPROACH
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Proposed Solutions</h2>
            <p className="text-lg text-gray-300">
              Our research team is developing cutting-edge approaches to overcome these challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionsList.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-[#1a1a2f]/50 border border-white/10 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-2" style={{ backgroundColor: solution.color }}></div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">{solution.title}</h3>
                    <p className="text-gray-300 mb-6">{solution.description}</p>
                    <ul className="space-y-3 mb-6">
                      {solution.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: solution.color }} />
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="flex items-center gap-2 font-medium hover:gap-3 transition-all duration-300" style={{ color: solution.color }}>
                      Learn more <ArrowRight className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#0f0f1a]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to see our solutions in action?</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Contact our team to schedule a demo and discover how our technologies can transform your approach to person re-identification.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="button-primary">
                Request Demo
              </button>
              <button className="button-secondary">
                Talk to an Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Solutions;
