import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  
  role: yup.string().oneOf(["trader", "investor"]).required("Role is required"),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "investor",
    },
  });

  const handleSignup = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      await signup({
        name: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      toast.success("Account Created Successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">CopyFi</span>
        </div>

        {/* Form Card */}
        <div className="glass-card p-7 border border-border/50 shadow-lg rounded-lg backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground text-center mb-2">
              Create your account
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Join thousands of traders and investors
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">User Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Alex Kim"
                          autoComplete="username"
                          {...field}
                          className={cn(
                            "w-full h-10 px-3 rounded-md border text-sm transition-all",
                            "bg-background border-input placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                            fieldState.error && "border-destructive focus:ring-destructive"
                          )}
                        />
                        {!fieldState.error && field.value && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {fieldState.error && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs flex items-center gap-1">
                      {fieldState.error && (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          {fieldState.error.message}
                        </>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...field}
                          className={cn(
                            "w-full h-10 px-3 rounded-md border text-sm transition-all",
                            "bg-background border-input placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                            fieldState.error && "border-destructive focus:ring-destructive"
                          )}
                        />
                        {!fieldState.error && field.value && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {fieldState.error && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs flex items-center gap-1">
                      {fieldState.error && (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          {fieldState.error.message}
                        </>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                          className={cn(
                            "w-full h-10 px-3 pr-10 rounded-md border text-sm transition-all",
                            "bg-background border-input placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                            fieldState.error && "border-destructive focus:ring-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPw ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage className="text-xs flex items-center gap-1">
                        {fieldState.error && (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            {fieldState.error.message}
                          </>
                        )}
                      </FormMessage>
                      {!fieldState.error && field.value && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ✓ Strong password
                        </span>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Role</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger 
                          className={cn(
                            "w-full",
                            fieldState.error && "border-destructive focus:ring-destructive"
                          )}
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investor">
                            <span className="font-medium">Investor</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              — Copy & follow traders
                            </span>
                          </SelectItem>
                          <SelectItem value="trader">
                            <span className="font-medium">Trader</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              — Create & share strategies
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs flex items-center gap-1">
                      {fieldState.error && (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          {fieldState.error.message}
                        </>
                      )}
                    </FormMessage>
                    <FormDescription className="text-xs">
                      Choose your account type based on your trading goals
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-10 font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
          
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
