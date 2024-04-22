import { UpdateSemesterModuleInput } from "@/services/apiClient";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import { useUpdateSemesterModule } from "@/services/apiClient/hooks/useUpdateSemesterModules";
import { getChatSelectionState } from "@/components/util/useChatSelection";
import { OnDragEndResponder, OnDragStartResponder } from "@hello-pangea/dnd";
import { useModulesInScope } from "@/components/util/useModulesInScope";
import { useMessages } from "./useMessages";
import { useSemestersList } from "../SemestersList/useSemestersList";
import { useQueryClient } from "@tanstack/react-query";

/**
 * keeps track of what module is currently being dragged, and updates the study plan when a drag has been completed.
 */
export function useDragDropContext() {
  const { showInfoMessage } = useMessages();

  const { modules } = useModulesInScope();

  const studyPlan = useStudyPlan();

  const { updateStudyPlan } = useUpdateStudyPlan();

  const { semesters } = useSemestersList();

  const flattenedModules = semesters.flatMap((i) =>
    Object.values(i.modules).flat()
  );

  const onDragStart: OnDragStartResponder = (e) => {
    const { startDraggingChats } = getChatSelectionState();

    const draggedModuleId = e.draggableId.split(":")[2];

    const draggedModule = modules.find((i) => i.id === draggedModuleId);

    const assessment = flattenedModules.find(
      (i) => i.module.moduleIdentifier === draggedModule?.moduleIdentifier
    )?.assessment;

    if (draggedModule) {
      startDraggingChats([draggedModule], e.source.droppableId);

      if (
        assessment &&
        assessment.passed &&
        e.source.droppableId === "droppable:modules-list"
      ) {
        if (draggedModule.isGraded && assessment.grade) {
          showInfoMessage(
            `You already got a ${assessment.grade} in this module, but you can still retake it to level up 🍄`
          );
        } else {
          showInfoMessage(
            "You already passed this module, there is no need to retake it"
          );
        }
      }
    } else {
      alert("bruh");
      console.warn(
        "[useDragDropContext.onDragStart] dragged module not found:",
        e.draggableId
      );
    }
  };

  const onDragEnd: OnDragEndResponder = () => {
    if (!studyPlan.isSuccess) return;

    const {
      targetSemester,
      targetCategory,
      sourceSemester,
      sourceCategory,

      draggedModules,
      isDraggingChats,

      stopDraggingChats,
    } = getChatSelectionState();

    if (isDraggingChats) {
      const draggedModule = draggedModules[0];

      updateStudyPlan(
        [
          {
            id: draggedModule.id,
            semesterId: targetSemester,
            categoryId: targetCategory,
          },
        ],
        [
          {
            id: draggedModule.id,
            semesterId: sourceSemester,
            categoryId: sourceCategory,
          },
        ]
      );
    } else {
      console.warn("[useDragDropContext.onDragEnd] not executed");
    }
    stopDraggingChats();
  };
  return {
    onDragStart,
    onDragEnd,
  };
}

export function useUpdateStudyPlan() {
  const studyPlan = useStudyPlan();

  const updateSemesterModule = useUpdateSemesterModule();

  async function updateStudyPlan(
    modulesToAdd: { id: string; semesterId: string; categoryId: string }[],
    modulesToRemove: { id: string; semesterId: string; categoryId: string }[]
  ) {
    if (!studyPlan.isSuccess) return;

    const body = studyPlan.data.semesters.reduce<UpdateSemesterModuleInput>(
      (acc, semester) => {
        acc[semester.id] = semester.modules;

        for (const toAdd of modulesToAdd) {
          if (semester.id === toAdd.semesterId) {
            // @ts-ignore
            acc[semester.id][toAdd.categoryId].push({
              moduleId: toAdd.id,
            });
          }
        }
        for (const toRemove of modulesToRemove) {
          if (semester.id === toRemove.semesterId) {
            // @ts-ignore
            acc[semester.id][toRemove.categoryId] = acc[semester.id][
              toRemove.categoryId
              // @ts-ignore
            ].filter((i) => i.moduleId !== toRemove.id);
          }
        }
        return acc;
      },
      {}
    );
    await updateSemesterModule.mutateAsync(body);
  }
  return {
    updateStudyPlan,
  };
}
