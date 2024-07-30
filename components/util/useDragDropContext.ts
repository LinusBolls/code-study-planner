import { OnDragEndResponder, OnDragStartResponder } from "@hello-pangea/dnd";

import { SemesterModulePutDTO } from "@/backend/dtos/semester-module.dto";
import { getChatSelectionState } from "@/components/util/useChatSelection";
import { useModulesInScope } from "@/components/util/useModulesInScope";
import { SemesterModuleCategory } from "@/services/apiClient";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import { useUpdateSemesterModule } from "@/services/apiClient/hooks/useUpdateSemesterModules";

import { useSemestersList } from "../SemestersList/useSemestersList";
import { useMessages } from "./useMessages";

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
    Object.values(i.modules).flat(),
  );

  const onDragStart: OnDragStartResponder = (e) => {
    const { startDraggingChats } = getChatSelectionState();

    const draggedModuleId = e.draggableId.split(":")[2];

    const draggedModule = modules.find((i) => i.id === draggedModuleId);

    const existingModules = flattenedModules.filter(
      (i) => i.module.moduleIdentifier === draggedModule?.moduleIdentifier,
    );
    const isPlanned = existingModules.some((i) => i.type === "planned");

    const assessments = existingModules.map((i) => i.assessment);

    const alreadyPassed = assessments.find((i) => i?.passed);

    const pending = assessments.find((i) => i?.published === false);

    if (draggedModule) {
      startDraggingChats([draggedModule], e.source.droppableId);

      const canGradeBeImproved = alreadyPassed
        ? (alreadyPassed.grade ?? 0) < 4
        : false;

      const isDraggingFromModulesList =
        e.source.droppableId === "droppable:modules-list";

      if (isDraggingFromModulesList) {
        if (alreadyPassed) {
          if (draggedModule.isGraded && alreadyPassed.grade) {
            // transform e.g. 4 to 4.0
            const grade = alreadyPassed.grade.toFixed(1);

            if (canGradeBeImproved) {
              showInfoMessage(
                `You already got a ${grade} in this module, but you can retake it to level up 🍄`,
              );
            } else {
              showInfoMessage(
                `You already got a ✨ perfect grade ✨ in this module, there is no need to retake it 🎉`,
              );
            }
          } else {
            showInfoMessage(
              "You already passed this module, there is no need to retake it 🎉",
            );
          }
        } else if (isPlanned) {
          showInfoMessage("This module is already part of your study plan");
        } else if (pending) {
          showInfoMessage(
            "You already have an upcoming assessment for this module",
          );
        }
      }
    } else {
      console.warn(
        "[useDragDropContext.onDragStart] dragged module not found:",
        e.draggableId,
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
        ],
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
    modulesToAdd: {
      id: string;
      semesterId: string;
      categoryId: SemesterModuleCategory;
    }[],
    modulesToRemove: {
      id: string;
      semesterId: string;
      categoryId: SemesterModuleCategory;
    }[],
  ) {
    if (!studyPlan.isSuccess) return;

    const body = studyPlan.data.semesters.reduce<SemesterModulePutDTO>(
      (acc, semester) => {
        acc[semester.id] = semester.modules;

        for (const toAdd of modulesToAdd) {
          if (semester.id === toAdd.semesterId) {
            acc[semester.id][toAdd.categoryId].push({
              moduleId: toAdd.id,
            });
          }
        }
        for (const toRemove of modulesToRemove) {
          if (semester.id === toRemove.semesterId) {
            acc[semester.id][toRemove.categoryId] = acc[semester.id][
              toRemove.categoryId
            ].filter((i) => i.moduleId !== toRemove.id);
          }
        }
        return acc;
      },
      {},
    );
    await updateSemesterModule.mutateAsync(body);
  }
  return {
    updateStudyPlan,
  };
}
