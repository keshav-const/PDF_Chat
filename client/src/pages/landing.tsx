import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, Brain, MessageSquare, Shield, Upload, Play, Calendar, Clock, Bookmark, Share, Trash2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <FileText className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold gradient-text">DocuChat AI</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/auth">
                <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-signin">
                  Sign In
                </button>
              </Link>
              <Link href="/auth">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg hover-glow transition-all" data-testid="button-get-started">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-1s" }}></div>
        </div>
        
        <div className="container mx-auto px-6 pt-20 pb-16 text-center relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your <span className="gradient-text">PDFs</span><br />
            Into Intelligent <span className="gradient-text">Conversations</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Upload any PDF and chat with your documents using advanced AI. Get instant answers, insights, and summaries from your files.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/auth">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover-glow transition-all" data-testid="button-start-trial">
                <Upload className="mr-2 h-5 w-5" />
                Start Free Trial
              </button>
            </Link>
            <button className="glass-effect text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover-glow transition-all" data-testid="button-watch-demo">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </motion.div>
          
          {/* Feature highlights */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-effect p-6 rounded-2xl hover-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">Advanced natural language processing to understand your documents deeply</p>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl hover-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Conversations</h3>
              <p className="text-muted-foreground">Contextual chat that remembers your conversation history</p>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl hover-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">Bank-level security with end-to-end encryption</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <FileText className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold gradient-text">DocuChat AI</span>
              </div>
              <p className="text-muted-foreground mb-4">Transform your documents into intelligent conversations with advanced AI technology.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">API</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Status</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Blog</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center">
            <p className="text-muted-foreground">&copy; 2024 DocuChat AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
