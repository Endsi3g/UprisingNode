"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api.service";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming email is passed via context, query param or local storage.
      // For this specific flow, we might need to know WHO we are verifying.
      // However, usually OTP follows login/signup.
      // If this is email verification, we might have a token or just user email.
      // For now, let's assume we need to prompt or we rely on session if partially logged in.
      // But usually OTP is pre-auth.
      // Let's assume we stored email in localStorage during signup/login step 1.
      const email = localStorage.getItem("auth_email");
      if (!email) {
         toast.error("Session expiré", { description: "Veuillez vous reconnecter." });
         router.push("/login");
         return;
      }

      await authService.verifyOtp(email, value);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Code invalide", { description: "Veuillez réessayer." });
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Enter verification code</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to your email.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP maxLength={6} id="otp" value={value} onChange={setValue} required>
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Button type="submit">Verify</Button>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code? <a href="#">Resend</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
