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
import { useUpdateSemesterModule } from "@/services/apiClient/hooks/useUpdateSemesterModules";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import {
  SemesterModuleCategory,
  UpdateSemesterModuleInput,
} from "@/services/apiClient";

export default function Page() {
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

  const updateSemesterModule = useUpdateSemesterModule();

  const studyPlan = useStudyPlan();

  const onDragEnd: OnDragEndResponder = () => {
    if (!studyPlan.isSuccess) return;

    const {
      draggedModules,
      dropTargetInboxId,
      sourceInboxId,
      isDraggingChats,

      stopDraggingChats,
    } = getChatSelectionState();

    if (isDraggingChats) {
      const [_, __, targetSemester, targetCategory] =
        dropTargetInboxId?.split(":") ?? [];

      const [___, ____, sourceSemester, sourceCategory] =
        sourceInboxId?.split(":") ?? [];

      const body = studyPlan.data.semesters.reduce<UpdateSemesterModuleInput>(
        (acc, i) => {
          acc[i.id] = i.modules;

          if (i.id === targetSemester) {
            acc[i.id]![targetCategory as SemesterModuleCategory]!.push({
              moduleId: draggedModules[0].id,
            });
          }
          if (i.id === sourceSemester) {
            acc[i.id]![sourceCategory as SemesterModuleCategory] = acc[i.id]![
              sourceCategory as SemesterModuleCategory
            ]!.filter((i) => i.moduleId !== draggedModules[0].id);
          }
          return acc;
        },
        {}
      );
      console.info(
        "[onDragEnd]",
        targetSemester,
        targetCategory,
        sourceSemester,
        sourceCategory,
        studyPlan.data.semesters,
        body
      );
      updateSemesterModule.mutate(body);
    } else {
      console.warn("[onDragEnd] not executed");
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
