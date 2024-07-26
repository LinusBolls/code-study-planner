import dynamic from "next/dynamic";

import { WithProviders } from "@/components/withProviders";

const DynamicHomePage = dynamic(() => import("../components/HomePage"), {
  ssr: false,
});

export default function Page() {
  return (
    <WithProviders>
      <DynamicHomePage />
    </WithProviders>
  );
}
