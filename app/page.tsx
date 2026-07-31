import { serviceStatus } from "@/lib/closures";
import { Storefront } from "@/components/Storefront";

// The Hebrew-calendar status is time-dependent, so this page renders per
// request rather than being baked at build time.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const status = serviceStatus();
  return <Storefront status={status} />;
}
