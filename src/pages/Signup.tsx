import { motion } from "framer-motion";
import { Link } from "wouter";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, Mail, Lock, ArrowRight, Github } from "lucide-react";
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
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { api } from "../api/apiClient";

const signupSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = searchParams.get("role");

  console.log("role:", role);

  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      userName: "",
    },
  });



  // const onSubmit = async (data: z.infer<typeof signupSchema>) => {
  //   if (!role || !["patient", "doctor"].includes(role)) {
  //     toast({
  //       title: "Invalid signup request",
  //       description: "Account type is missing or invalid.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       data.email,
  //       data.password
  //     );

  //     if (!userCredential.user) {
  //       throw new Error("User creation failed.");
  //     }

  //     // Navigate based on role
  //     const redirectPath =
  //       role === "patient"
  //         ? "/OnboardingPatient"
  //         : "/OnboardingPatient";

  //     navigate(redirectPath);

  //   } catch (error: any) {
  //     console.error("Signup error:", error);

  //     toast({
  //       title: "Signup failed",
  //       description:
  //         error?.code === "auth/email-already-in-use"
  //           ? "This email is already registered."
  //           : error?.message || "Something went wrong.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    if (!role || !["patient", "doctor"].includes(role)) {
      toast({
        title: "Invalid signup request",
        description: "Account type is missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1️⃣ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!userCredential.user) {
        throw new Error("User creation failed.");
      }

      const firebaseUser = userCredential.user;

      // 2️⃣ Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // 3️⃣ Call your backend signup API

      const response = await api.post("/auth/signup", {
        email: data.email,
        role: role,
        userName: data.userName,
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Backend signup failed");
      }

      // 4️⃣ Navigate only after backend success
      const redirectPath =
        role === "patient"
          ? "/OnboardingPatient"
          : "/OnboardingDoctor";

      navigate(redirectPath);

    } catch (error: any) {
      console.error("Signup error:", error);

      toast({
        title: "Signup failed",
        description:
          error?.code === "auth/email-already-in-use"
            ? "This email is already registered."
            : error?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex grid lg:grid-cols-2">
      {/* Left Side: Illustration/Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-[#13B7A2] relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-8">
            <Activity className="h-8 w-8" />
            <span className="font-display text-3xl font-bold">auraH</span>
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Start Your <br />
            Health Journey <br />
            With Aura.
          </h1>
          <p className="text-xl opacity-80 max-w-md leading-relaxed">
            Join thousands of users who trust Aura Health for their wellness needs and professional medical connections.
          </p>
        </motion.div>

        <div className="absolute bottom-12 left-12 flex items-center gap-4 text-sm opacity-60">
          <span>&copy; 2026 Aura Health Inc.</span>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold mb-2">Create Account</h2>
            <p className="text-muted-foreground">Sign up to get started with your healthcare dashboard.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
                        className="h-12"
                        {...field}
                        data-testid="input-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-10 h-12"
                          {...field}
                          data-testid="input-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-12"
                          {...field}
                          data-testid="input-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-[#13B7A2] text-lg text-white font-bold shadow-lg shadow-[#13B7A2]/20"
                data-testid="button-signup"
              >
                Sign Up <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl gap-2" type="button">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-12 rounded-xl gap-2" type="button">
                  <Github className="h-5 w-5" />
                  Github
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-8">
                Already have an account?{" "}
                <Link href="/" className="text-[#13B7A2] font-bold hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}