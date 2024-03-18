"use client";

import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { DragDropContext, DraggableProvided } from "@hello-pangea/dnd";
import {
  Button,
  CardProps,
  Flex,
  Input,
  Modal,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { modules, useSemesters } from "./useSemesters";
import SemesterCard from "@/components/Semester";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { useRef, useState } from "react";
import { useChatSelection } from "@/useChatSelection";
import ModulesSearch, { ModulesSearchProps } from "@/components/ModulesSearch";
import { create } from "zustand";
import ModulesInfoPanel from "@/components/ModulesInfoPanel";
import { useLearningPlatform } from "@/services/learningPlatform/useLearningPlatform";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import LoginModal from "@/components/LoginModal";

export interface ModulesSearchStore {
  searchQuery: string;

  onlyMandaryOrCompulsoryElective: boolean;
  onlyAlternativeAssessment: boolean;
  onlyEarlyAssessment: boolean;

  actions: {
    setSearchQuery: (query: string) => void;
    setOnlyMandaryOrCompulsoryElective: (value: boolean) => void;
    setOnlyAlternativeAssessment: (value: boolean) => void;
    setOnlyEarlyAssessment: (value: boolean) => void;
  };
}
const modulesSearchStore = create<ModulesSearchStore>(() => ({
  searchQuery: "",
  onlyMandaryOrCompulsoryElective: false,
  onlyAlternativeAssessment: false,
  onlyEarlyAssessment: false,

  actions: {
    setSearchQuery: (query: string) => {
      modulesSearchStore.setState({ searchQuery: query });
    },
    setOnlyMandaryOrCompulsoryElective: (value: boolean) => {
      modulesSearchStore.setState({ onlyMandaryOrCompulsoryElective: value });
    },
    setOnlyAlternativeAssessment: (value: boolean) => {
      modulesSearchStore.setState({ onlyAlternativeAssessment: value });
    },
    setOnlyEarlyAssessment: (value: boolean) => {
      modulesSearchStore.setState({ onlyEarlyAssessment: value });
    },
  },
}));

const useModulesSearch = (): ModulesSearchProps => {
  const store = modulesSearchStore();

  const sachen = useLearningPlatformModules();

  const modules =
    sachen.data?.currentSemesterModules?.map((i) => {
      return {
        id: i.id,
        title: i.module?.title!,
        coordinatorName: i.module?.coordinator?.name!,
        url: "#",
        coordinatorUrl: "#",

        ects: i.module?.ects!,
        isMandatory: false,
        isCompulsoryElective: false,
        departmentId: i.module?.department?.abbreviation!,

        allowEarlyAssessment: false,
        allowAlternativeAssessment: false,
      };
    }) ?? [];

  return {
    modules,
    ...store,
    onOnlyAlternativeAssessmentChange:
      store.actions.setOnlyAlternativeAssessment,
    onOnlyEarlyAssessmentChange: store.actions.setOnlyEarlyAssessment,
    onOnlyMandaryOrCompulsoryElectiveChange:
      store.actions.setOnlyMandaryOrCompulsoryElective,
    onSearchQueryChange: store.actions.setSearchQuery,
  };
};

export default function Page() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Modules",
      children: <ModulesSearch {...useModulesSearch()} />,
    },
    {
      key: "2",
      label: "Info",
      children: <ModulesInfoPanel />,
    },
  ];

  const {
    semesters,
    actions: { addModuleToSemester, removeModuleFromSemester },
  } = useSemesters();

  const sidebarRef = useRef<ImperativePanelHandle>(null);

  const rem = (100 / window.innerWidth) * 16;

  const sidebarMinWidth = 26 * rem;
  const sidebarCollapsedWidth = 3 * rem;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    draggedModules,
    dropTargetInboxId,
    sourceInboxId,
    isDraggingChats,
    actions: { startDraggingChats, stopDraggingChats },
  } = useChatSelection();

  const { signInWithAccessToken, isAuthenticated } = useLearningPlatform();

  return (
    <>
      {!isAuthenticated && <LoginModal onSubmit={signInWithAccessToken} />}
      <DragDropContext
        onDragStart={(e) => {
          const moduleId = e.draggableId.split(":")[2];

          const draggedModule = modules[moduleId as keyof typeof modules];

          if (!draggedModule) {
            console.error("Module not found:", e.draggableId);
          }
          startDraggingChats([draggedModule], e.source.droppableId);
        }}
        onDragEnd={() => {
          if (dropTargetInboxId && isDraggingChats) {
            const [_, __, targetSemester, targetCategory] =
              dropTargetInboxId.split(":");

            const [___, ____, sourceSemesterId, sourceCategory] =
              sourceInboxId!.split(":");

            console.log(
              targetSemester,
              targetCategory,
              sourceSemesterId,
              sourceCategory
            );

            addModuleToSemester(
              targetSemester,
              targetCategory,
              draggedModules[0].id
            );
            removeModuleFromSemester(
              sourceSemesterId,
              sourceCategory,
              draggedModules[0].id
            );
          } else {
            console.log(
              "[debug] onDragEnd not executed:",
              dropTargetInboxId,
              isDraggingChats
            );
          }
          stopDraggingChats();
        }}
      >
        <main className="bg-white w-screen h-screen flex">
          <PanelGroup autoSaveId="example" direction="horizontal">
            <Panel>
              <Flex
                style={{
                  overflow: "scroll",
                  height: "100%",
                  // backgroundColor: "#F9F8F7",
                }}
              >
                <Flex
                  gap="2rem"
                  style={{
                    padding: "1.5rem",
                  }}
                >
                  {semesters.map((semester) => (
                    <SemesterCard
                      key={semester.id}
                      semester={semester}
                      isDragging={isDraggingChats}
                    />
                  ))}
                </Flex>
              </Flex>
            </Panel>
            <PanelResizeHandle />
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
                    borderBottom: "1px solid #F0F0F0",
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
                      defaultActiveKey="1"
                      items={items}
                      tabBarStyle={{
                        margin: "0 1.5rem",
                        marginBottom: 0,
                        // boxShadow: "rgba(29, 35, 41, 0.05) 0px 2px 8px 0px",
                      }}
                    />
                  </Flex>
                )}
              </Flex>
            </Panel>
          </PanelGroup>
        </main>
      </DragDropContext>
    </>
  );
}

export interface ModuleCardProps extends CardProps {
  provided: DraggableProvided;
  isDragging?: boolean;
}
