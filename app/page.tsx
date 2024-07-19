import { WithProviders } from "@/components/withProviders";

import dynamic from "next/dynamic";

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
