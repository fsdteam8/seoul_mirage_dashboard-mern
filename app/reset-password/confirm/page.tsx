// app/reset-password/confirm/page.tsx
import { Suspense } from "react";
import NewPasswordPage from "./_components/ResetPasswordClient";
// import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordPage />
    </Suspense>
  );
}
