
import { motion } from "framer-motion";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

const Vision = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Vision Hero Section */}
      <section className="container-padding py-32 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="heading-xl mb-6">Our Vision</h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              A repository for the recognition of people, objects, scenes and events
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Vision Detailed Section */}
      <section className="container-padding py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
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
            <p className="text-lg mb-10">
              While our immediate focus is solving the fundamental challenge of person re-identification, our broader mission is to advance the entire field of recognition-based agent intelligence — bringing AI one step closer to the intuitive understanding demonstrated by the human brain.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Recognition vs. Retrieval</h2>
            <p className="text-lg mb-6">
              The distinction between recognition and retrieval is fundamental to understanding our approach. Retrieval simply pulls information from a database, while recognition identifies patterns and relationships regardless of their specific representation.
            </p>
            <p className="text-lg mb-6">
              Human intelligence excels at recognition: we can identify a person despite changes in lighting, clothing, or age. We can understand concepts across different domains and contexts. This invariant representation is what we aim to build into our AI systems.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">The Future of AI</h2>
            <p className="text-lg mb-6">
              We believe that the next breakthrough in artificial intelligence will come not from larger models or more data, but from a fundamentally different approach to how machines understand and interact with the world.
            </p>
            <p className="text-lg">
              By building systems that truly recognize rather than merely retrieve, we're creating the foundation for AI that can reason, plan, and adapt in ways that current systems cannot. This is not just an incremental improvement — it's a paradigm shift that will unlock entirely new capabilities for artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Vision;
