import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { loginSchema, signupSchema, type LoginData, type SignupData, type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { login, signup } from "@/lib/auth";
import { FileText, User as UserIcon } from "lucide-react";

interface AuthProps {
  setUser: (user: User | null) => void;
}

export default function Auth({ setUser }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const user = await login(data);
      setUser(user);
      setLocation("/dashboard");
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const user = await signup(data);
      setUser(user);
      setLocation("/dashboard");
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Signup failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer" data-testid="link-home">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <FileText className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold gradient-text">DocuChat AI</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md glass-effect border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserIcon className="text-white text-2xl" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to continue to your dashboard" : "Sign up to get started with DocuChat AI"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginForm.register("email")}
                    className="mt-2"
                    placeholder="your@email.com"
                    data-testid="input-email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register("password")}
                    className="mt-2"
                    placeholder="••••••••"
                    data-testid="input-password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:text-primary/80">Forgot password?</a>
                </div>

                <Button
                  type="submit"
                  className="w-full hover-glow"
                  disabled={isLoading}
                  data-testid="button-signin"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-6">
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    {...signupForm.register("email")}
                    className="mt-2"
                    placeholder="your@email.com"
                    data-testid="input-signup-email"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    {...signupForm.register("password")}
                    className="mt-2"
                    placeholder="••••••••"
                    data-testid="input-signup-password"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...signupForm.register("confirmPassword")}
                    className="mt-2"
                    placeholder="••••••••"
                    data-testid="input-confirm-password"
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full hover-glow"
                  disabled={isLoading}
                  data-testid="button-signup"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            )}

            <div className="text-center mt-6">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 font-semibold"
                data-testid="button-toggle-auth"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
