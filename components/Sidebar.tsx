import { Badge, Button, Flex, Modal, Tabs, TabsProps } from "antd";
import { useRef, useState } from "react";
import { ImperativePanelHandle, Panel } from "react-resizable-panels";
import ECTSPanel from "./ECTSPanel";
import SuggestionsPanel from "./SuggestionsPanel";
import ModulesSearch from "./ModulesSearch";
import { useModulesSearch } from "./ModulesSearch/useModulesSearch";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { urlParams } from "@/services/learningPlatform/util/urlParams";
import { create } from "zustand";
import { useECTSPanel } from "./ECTSPanel/useECTSPanel";
import { useSuggestions } from "@/components/SuggestionsPanel/useSuggestionsPanel";
import { EXPERIMENTAL_STUDY_PLAN_SHARING } from "@/experimental";
import StudyPlanSettings from "./StudyPlanSettings";
import useScreenSize from "./util/useScreenSize";

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

export interface SidebarProps {}
export default function Sidebar({}: SidebarProps) {
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  const {
    isSidebarCollapsed,
    actions: { setIsSidebarCollapsed },
  } = useLayoutStore();

  const rem = isBrowser ? (100 / window.innerWidth) * 16 : 0;

  const sidebarMinWidth = 32 * rem;
  const sidebarCollapsedWidth = 3 * rem;

  const suggestionsPanelProps = useSuggestions();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const items: TabsProps["items"] = [
    {
      key: "modules",
      label: "Modules",
      children: <ModulesSearch {...useModulesSearch()} {...useScreenSize()} />,
    },
    {
      key: "suggestions",
      label: (
        <Flex gap="0.25rem">
          Suggestions
          {!suggestionsPanelProps.isLoading && (
            <Badge
              count={suggestionsPanelProps.suggestions.length}
              color="#E6E6E6"
              style={{
                color: "#5D5D5D",
              }}
            />
          )}
        </Flex>
      ),
      children: <SuggestionsPanel {...suggestionsPanelProps} />,
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
            justifyContent: "space-between",
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
          {EXPERIMENTAL_STUDY_PLAN_SHARING && !isSidebarCollapsed && (
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined style={{ color: "#8C8C8C" }} />}
              onClick={() => setIsSettingsModalOpen(true)}
            />
          )}
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
      {isSettingsModalOpen && (
        <Modal
          onOk={() => setIsSettingsModalOpen(false)}
          onCancel={() => setIsSettingsModalOpen(false)}
          title="Share this study plan"
          open={true} // onOk={handleOk}
          width="72rem"
          cancelButtonProps={{
            style: { display: "none" },
          }}
        >
          <StudyPlanSettings />
        </Modal>
      )}
    </Panel>
  );
}
