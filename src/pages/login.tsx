import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Activity,
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
  Brain,
  Stethoscope,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/signup/form";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log("Login data:", data);
    toast({
      title: "Welcome back!",
      description: "Successfully logged into your Aura Health account.",
    });
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="flex w-full h-screen overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col w-1/2 relative bg-[#13B7A2] p-16 justify-between text-white overflow-hidden">
          
          <div className="absolute inset-0 z-0">
            <img
              src="/images/login-hero.png"
              alt="Healthcare professional"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13B7A2] via-[#13B7A2]/30 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <Link
              to="/"
              className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity"
            >
               <Button className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 gap-2 shadow-2xl h-12 px-6">
            <ArrowLeft className="h-5 w-5" /> Back to Aura
          </Button>
            </Link>

            <h1 className="text-6xl font-bold mb-8 leading-tight">
              Personalized <br />
              Healthcare, <br />
              <span className="text-teal-200">Reimagined.</span>
            </h1>

            <div className="space-y-6 max-w-md">
              
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                <div className="h-12 w-12 rounded-2xl bg-teal-400/20 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-6 w-6 text-teal-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    Top-tier Specialists
                  </h3>
                  <p className="text-sm opacity-80">
                    Access over 5,000+ verified medical experts globally.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                <div className="h-12 w-12 rounded-2xl bg-purple-400/20 flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Diagnostics</h3>
                  <p className="text-sm opacity-80">
                    Real-time health monitoring powered by Aura AI.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          <div className="relative z-10 text-sm opacity-70 flex items-center gap-6">
            <span>&copy; 2026 Aura Health</span>
            <span className="h-1 w-1 bg-white rounded-full" />
            <span>Trusted by 10k+ patients</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="mb-12">
              
              <div className="lg:hidden flex items-center gap-2 mb-8">
                <Activity className="h-8 w-8 text-[#13B7A2]" />
                <span className="text-2xl font-bold text-[#13B7A2]">
                  auraH
                </span>
              </div>

              <h2 className="text-4xl font-bold mb-3 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-lg">
                Continue your journey to better health.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-4">

                  {/* EMAIL */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#13B7A2] transition-colors" />
                            <Input
                              placeholder="john@aura.health"
                              className="pl-12 h-16 bg-gray-50 border-gray-200 rounded-2xl focus-visible:ring-[#13B7A2] focus-visible:border-[#13B7A2] text-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PASSWORD */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">
                            Password
                          </FormLabel>
                          <a
                            href="#"
                            className="text-sm font-bold text-[#13B7A2] hover:text-[#11a394]"
                          >
                            Forgot Password?
                          </a>
                        </div>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#13B7A2] transition-colors" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-12 h-16 bg-gray-50 border-gray-200 rounded-2xl focus-visible:ring-[#13B7A2] focus-visible:border-[#13B7A2] text-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full h-16 rounded-2xl text-xl font-bold bg-[#13B7A2] hover:bg-[#11a394] shadow-2xl shadow-[#13B7A2]/30 transition-all hover:scale-[1.01] active:scale-95 text-white"
                >
                  Log In <LogIn className="ml-2 h-6 w-6" />
                </Button>

                <div className="flex items-center gap-4 text-sm text-gray-400 pt-2">
                  <span className="flex-1 h-px bg-gray-200" />
                  <span>SECURE ACCESS</span>
                  <span className="flex-1 h-px bg-gray-200" />
                </div>

                <p className="text-center text-lg text-gray-500 pt-4">
                  New to Aura?{" "}
                  <Link
                    to="/get-started"
                    className="text-[#13B7A2] font-bold hover:underline"
                  >
                    Join Today
                  </Link>
                </p>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>

      {/* FLOATING BUTTON */}
      {/* <Link href="/">
        <motion.div
          whileHover={{ x: -5 }}
          className="fixed top-12 right-12 lg:left-12 lg:right-auto hidden lg:block"
        >
          <Button className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 gap-2 shadow-2xl h-12 px-6">
            <ArrowLeft className="h-5 w-5" /> Back to Aura
          </Button>
        </motion.div>
      </Link> */}
    </div>
  );
}
