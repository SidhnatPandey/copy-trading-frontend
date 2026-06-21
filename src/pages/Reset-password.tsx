import { useState } from "react";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/apiService/authService";

const ResetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password")
});

type ResetPasswordFormValues = yup.InferType<typeof ResetPasswordSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (values: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      await resetPassword({"password": values.password, "token": token});
      toast.success("Password has been reset successfully!");
      const from = location.state?.from?.pathname || "/traders";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password. Please try again.");
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
              Reset Password
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Enter your new password below
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Enter your new password"
                          autoComplete="new-password"
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
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Confirm your password"
                          autoComplete="confirm-new-password"
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
              <Button 
                type="submit" 
                className="w-full h-10 font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Resetting password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </div>         
      </div>
    </div>
  );
}
