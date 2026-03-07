import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <HomeClient
      userId={user?.id || null}
      email={user?.email || ""}
      fullName={user?.user_metadata?.full_name || ""}
    />
  );
}
