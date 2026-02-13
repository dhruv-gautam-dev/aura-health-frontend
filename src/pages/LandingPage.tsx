import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Globe,
  Heart,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  User,
  Zap
} from "lucide-react";
import { Button } from "../../src/components/ui/landing/btn"
import { Input } from "../../src/components/ui/input";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Activity className="h-8 w-8 text-white bg-[#13B7A2] rounded-md p-1" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">AuraH</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Patients</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Doctors</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">AI Features</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center gap-5">
            <button className="hidden sm:block text-sm font-medium text-gray-800 hover:text-gray-900">
              Sign In
            </button>
            <button
              onClick={() => navigate("/RoleSelectionPage")}
              className="
inline-flex items-center gap-2
rounded-full
bg-[#13B7A2]
px-5 py-2.5
text-sm font-medium text-white
shadow-[0_8px_20px_rgba(19,183,162,0.25)]
hover:shadow-[0_10px_24px_rgba(19,183,162,0.35)]
transition-all
    "
            >
              Get Started
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#13B7A2]/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/4" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 fill-current" />
              <span>Now powered by Aura AI 2.0</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 text-slate-900">
              Healthcare <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#13B7A2] via-[#6B8DFF] to-[#8B5CF6]">Reimagined</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Connect with top-tier medical professionals and get instant, AI-powered health insights. Your wellness journey starts here.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-[#13B7A2] hover:bg-[#0FAF9A] shadow-xl shadow-[#13B7A2]/30">
                Find a Doctor
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/20 hover:border-secondary hover:text-secondary-foreground">
                <Brain className="mr-2 h-5 w-5" />
                Try Aura AI
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="font-semibold text-foreground">10,000+</span> patients today</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/20 bg-white/5 backdrop-blur-sm p-2">
              <img
                src="/images/hero-abstract.png"
                alt="Healthcare Innovation"
                className="rounded-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -right-8 top-20 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border border-border/50 max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Heart className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="text-lg font-bold">72 bpm</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-green-50 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-green-500 rounded-full" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-8 bottom-20 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4"
              >
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Aura AI</p>
                  <p className="text-xs text-muted-foreground">Analysis Complete</p>
                </div>
                <div className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                  98%
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Complete Health Ecosystem</h2>
            <p className="text-muted-foreground text-lg">Everything you need to manage your health, from finding specialists to AI-powered diagnostics.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Stethoscope className="h-8 w-8 text-primary" />}
              title="Expert Doctors"
              description="Browse thousands of verified specialists. Filter by rating, location, and specialty."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-600" />}
              title="Aura AI Assistant"
              description="Get instant answers to your health questions. Powered by advanced medical LLMs."
              highlight
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-blue-600" />}
              title="Secure Records"
              description="Your medical history, prescriptions, and lab results in one encrypted vault."
            />
          </div>
        </div>
      </section>

      {/* Interactive AI Demo Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Chat Preview */}
          <div className="order-2 lg:order-1 relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-[#13B7A2]/20 blur-[110px] rounded-full" />

            <div className="relative bg-background border border-border shadow-2xl rounded-3xl overflow-hidden max-w-md mx-auto">
              {/* Header */}
              <div className="bg-muted/50 p-4 border-b flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-auto text-xs text-muted-foreground font-mono">
                  Aura AI Chat
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 h-[400px] overflow-y-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-400 shrink-0">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-sm">
                    Hello! I'm Aura. How are you feeling today?
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#13B7A2]/20 flex items-center justify-center text-[#13B7A2] shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="bg-[#13B7A2] text-white p-3 rounded-2xl rounded-tr-none text-sm">
                    I've had a mild headache since this morning.
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-sm">
                    I see. Have you been drinking enough water? Let me check your hydration logs...
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-2 ml-12">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-[#13B7A2] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-2 h-2 bg-[#13B7A2] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[#13B7A2] rounded-full" />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-background">
                <div className="relative">
                  <Input
                    placeholder="Type your symptoms..."
                    className="pr-12 rounded-full border-muted-foreground/20"
                  />
                  <Button
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7 rounded-full 
              bg-[#13B7A2] hover:bg-[#0FAF9A]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Instant Answers. <br />
              <span className="text-[#13B7A2]">Personalized Care.</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Skip the wait times. Aura AI analyzes your symptoms, medical history, and vitals to provide immediate guidance and connect you with the right specialist if needed.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "24/7 Symptom Checker",
                "Medication Reminders",
                "Lifestyle Recommendations",
                "Seamless Doctor Hand-off",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="rounded-full bg-[#13B7A2] hover:bg-[#0FAF9A] 
        shadow-lg shadow-emerald-200 text-white"
            >
              Try Aura Demo
            </Button>
          </div>

        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden bg-[#13B7A2]">


            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-white/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-black/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-white">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ready to take control?</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-10 font-light">Join thousands of patients who have found their perfect healthcare match with Aura.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-14 px-12 text-lg rounded-full font-semibold bg-white text-teal-600 hover:bg-white/90 shadow-md">
                  Get Started Free
                </Button>

                <Button
                  size="lg"
                  className="h-14 px-12 text-lg rounded-full border border-white/40 bg-transparent text-white hover:bg-white/10">
                  Contact Sales
                </Button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 pt-20 pb-10 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-2 rounded-lg">
                  <Activity className="h-8 w-8 text-white bg-[#13B7A2] rounded-md p-1" />
                </div>
                <span className="font-display text-xl font-bold">AuraH</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Making healthcare accessible, intelligent, and human-centric for everyone, everywhere.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Find Doctors</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">AI Diagnostics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Telemedicine</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Records</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 Aura Health Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Globe className="h-5 w-5 hover:text-foreground cursor-pointer" />
              <MessageSquare className="h-5 w-5 hover:text-foreground cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight = false }: { icon: React.ReactNode, title: string, description: string, highlight?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-8 rounded-3xl border transition-all duration-300 ${highlight ? 'bg-secondary/5 border-secondary/20 shadow-lg shadow-purple-500/5' : 'bg-background hover:shadow-xl hover:shadow-primary/5'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${highlight ? 'bg-purple-100' : 'bg-primary/10'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
