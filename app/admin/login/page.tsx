import { LoginScreen } from "@/features/admin/auth/login-screen";
import { hasSupabaseEnv } from "@/server/supabase/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminLoginPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = (await searchParams) ?? {};
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return <LoginScreen envReady={hasSupabaseEnv()} message={params.message} tone={tone} />;
}
