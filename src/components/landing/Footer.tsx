
const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a15]">
      <div className="container-padding py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-full"></div>
              <span className="text-xl font-semibold text-white">EveryID</span>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Transforming recognition through advanced AI
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Applications</h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">TV Post Production</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Surveillance</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Intelligence & Defense</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Agent AI Frameworks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Vision</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Research</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">API</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#8B5CF6] transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-400">
            © 2024 EveryID. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-neutral-400 hover:text-[#8B5CF6] transition-colors">
              Twitter
            </a>
            <a href="#" className="text-neutral-400 hover:text-[#8B5CF6] transition-colors">
              GitHub
            </a>
            <a href="#" className="text-neutral-400 hover:text-[#8B5CF6] transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
