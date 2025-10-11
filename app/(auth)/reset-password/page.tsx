import { Suspense } from "react";
import ResetPasswordPage from "@/app/components/auth/ResetPasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordPage />
    </Suspense>
  );
}