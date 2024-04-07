"use client";

import {
  DragDropContext,
  OnDragEndResponder,
  OnDragStartResponder,
} from "@hello-pangea/dnd";
import { SemesterModule } from "./useSemesters";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getChatSelectionState } from "@/useChatSelection";
import { useLearningPlatform } from "@/services/learningPlatform/useLearningPlatform";
import LoginModal from "@/components/LoginModal";
import Sidebar, { useLayoutStore } from "@/components/Sidebar";
import { Layout } from "antd";
import SemestersList from "@/components/SemestersList";
import {
  useModulesInScope,
  useSemestersList,
} from "@/components/SemestersList/useSemestersList";
import Header from "@/components/Header";

export default function Page() {
  console.log("rendering page");

  const { signInWithAccessToken, isAuthenticated } = useLearningPlatform();

  const { modules } = useModulesInScope();

  const onDragStart: OnDragStartResponder = (e) => {
    const { startDraggingChats } = getChatSelectionState();

    const moduleId = e.draggableId.split(":")[2];

    const draggedModule = modules.find((i) => i.id === moduleId);

    if (!draggedModule) {
      console.error("Module not found:", e.draggableId);
    }
    startDraggingChats([draggedModule!], e.source.droppableId);
  };

  const onDragEnd: OnDragEndResponder = () => {
    const {
      draggedModules,
      dropTargetInboxId,
      sourceInboxId,
      isDraggingChats,

      stopDraggingChats,
    } = getChatSelectionState();

    if (dropTargetInboxId && isDraggingChats) {
      const [_, __, targetSemester, targetCategory] =
        dropTargetInboxId.split(":");

      const [___, ____, sourceSemesterId, sourceCategory] =
        sourceInboxId!.split(":");

      // addModuleToSemester(targetSemester, targetCategory, draggedModules[0].id);
      // removeModuleFromSemester(sourceSemesterId, sourceCategory, draggedModules[0].id);
    } else {
      console.log(
        "[debug] onDragEnd not executed:",
        dropTargetInboxId,
        isDraggingChats
      );
    }
    stopDraggingChats();
  };
  const modulesTakenByUser = useSemestersList().semesters.reduce<
    SemesterModule[]
  >((modules, i) => modules.concat(Object.values(i.modules).flat()), []);

  const { isSidebarCollapsed } = useLayoutStore();

  async function signIn(learningPlatformAccessToken: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ learningPlatformAccessToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to sign in");
    }
    const data = await res.json();

    localStorage.setItem("study-planner:session", data.accessToken);

    await signInWithAccessToken(learningPlatformAccessToken);
  }

  return (
    <>
      {!isAuthenticated && <LoginModal onSubmit={signIn} />}
      <Layout className="h-screen">
        <Header />
        <Layout.Content className="h-full">
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="bg-white w-full h-full flex">
              <PanelGroup autoSaveId="semester-planner" direction="horizontal">
                <SemestersList
                  {...useSemestersList()}
                  isZoomedOut={isSidebarCollapsed}
                />
                <PanelResizeHandle />
                <Sidebar modulesTakenByUser={modulesTakenByUser} />
              </PanelGroup>
            </div>
          </DragDropContext>
        </Layout.Content>
      </Layout>
    </>
  );
}
