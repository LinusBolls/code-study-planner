import { Badge, Button, Flex, Tabs, TabsProps } from "antd";
import { useRef } from "react";
import { ImperativePanelHandle, Panel } from "react-resizable-panels";
import ECTSPanel from "./ECTSPanel";
import SuggestionsPanel, { Suggestion } from "./SuggestionsPanel";
import ModulesSearch from "./ModulesSearch";
import { useModulesSearch } from "./ModulesSearch/useModulesSearch";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import { urlParams } from "@/services/learningPlatform/util/urlParams";
import { create } from "zustand";
import { useECTSPanel } from "./ECTSPanel/useECTSPanel";

const isBrowser = typeof window !== "undefined";

interface LayoutStore {
  isSidebarCollapsed: boolean;
  actions: {
    setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
  };
}
export const useLayoutStore = create<LayoutStore>((set) => ({
  isSidebarCollapsed: false,
  actions: {
    setIsSidebarCollapsed: (isSidebarCollapsed) =>
      set((state) =>
        state.isSidebarCollapsed === isSidebarCollapsed
          ? state
          : { isSidebarCollapsed }
      ),
  },
}));

const suggestions: Suggestion[] = [
  {
    title: "Compulsory elective",
    level: "error",
    description: (
      <>
        You are required to take either{" "}
        <Link href="#">SE_05 Relational Databases</Link> or{" "}
        <Link href="#">SE_06 NoSQL Databases</Link>.
      </>
    ),
    fix: () => {},
  },
  {
    title: "Missing prerequisite",
    level: "error",
    description: (
      <>
        You are required to take <Link href="#">SE_08 Clean Code</Link> before{" "}
        <Link href="#">SE_35 Software Modeling and Design patterns</Link>.
      </>
    ),
  },
  {
    title: "Advanced module",
    level: "warning",
    description: (
      <>
        <Link href="#">SE_35 Software Modeling and Design patterns</Link>{" "}
        assumes advanced software engineering experience, and should not be
        taken in your first core semester.
      </>
    ),
  },
  {
    title: "Schedule overlap",
    level: "warning",
    description: (
      <>
        The learning units for <Link href="#">SE_08 Clean Code</Link> and{" "}
        <Link href="#">SE_10 Automated Software Testing</Link> overlap.
      </>
    ),
    fix: () => {},
  },
];

export interface SidebarProps {}
export default function Sidebar({}: SidebarProps) {
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  const {
    isSidebarCollapsed,
    actions: { setIsSidebarCollapsed },
  } = useLayoutStore();

  const rem = isBrowser ? (100 / window.innerWidth) * 16 : 0;

  const sidebarMinWidth = 26 * rem;
  const sidebarCollapsedWidth = 3 * rem;

  const items: TabsProps["items"] = [
    {
      key: "modules",
      label: "Modules",
      children: <ModulesSearch {...useModulesSearch()} />,
    },
    {
      key: "suggestions",
      label: (
        <Flex gap="0.25rem">
          Suggestions
          <Badge
            count={suggestions.length}
            color="#E6E6E6" // "#1890FF"
            style={{
              color: "#5D5D5D",
            }}
          />
        </Flex>
      ),
      children: <SuggestionsPanel suggestions={suggestions} />,
    },
    {
      key: "ects",
      label: "ECTS",
      children: <ECTSPanel {...useECTSPanel()} />,
    },
  ];

  return (
    <Panel
      onResize={(size) => {
        setIsSidebarCollapsed(
          Math.round(size) === Math.round(sidebarCollapsedWidth)
        );
      }}
      ref={sidebarRef}
      defaultSize={sidebarMinWidth}
      minSize={sidebarMinWidth}
      style={{
        boxShadow: "rgba(15, 15, 15, 0.06) 0px 9px 24px 0px",
      }}
      collapsible
      collapsedSize={sidebarCollapsedWidth}
    >
      <Flex
        vertical
        style={{
          height: "100%",
          borderLeft: "1px solid #F0F0F0",
        }}
      >
        <Flex
          style={{
            padding: "0 1rem",
            height: "3rem",
            alignItems: "center",
            // borderBottom: "1px solid #F0F0F0",
          }}
        >
          <Button
            type="text"
            size="small"
            icon={
              isSidebarCollapsed ? (
                <DoubleLeftOutlined style={{ color: "#8C8C8C" }} />
              ) : (
                <DoubleRightOutlined style={{ color: "#8C8C8C" }} />
              )
            }
            onClick={() =>
              isSidebarCollapsed
                ? sidebarRef.current?.resize(sidebarMinWidth)
                : sidebarRef.current?.collapse()
            }
          />
        </Flex>
        {isSidebarCollapsed ? null : (
          <Flex
            vertical
            style={{
              height: "20rem",
            }}
          >
            <Tabs
              defaultActiveKey={urlParams.get("tab") ?? "modules"}
              onChange={(key) => urlParams.set("tab", key)}
              items={items}
              tabBarStyle={{
                margin: "0 1.5rem",
                marginBottom: 0,
              }}
            />
          </Flex>
        )}
      </Flex>
    </Panel>
  );
}
