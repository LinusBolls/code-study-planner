import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("../components/HomePage"), {
  ssr: false,
});

export default function Page() {
  return <HomePage />;
}
