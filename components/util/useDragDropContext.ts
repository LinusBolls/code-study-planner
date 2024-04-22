import { UpdateSemesterModuleInput } from "@/services/apiClient";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import { useUpdateSemesterModule } from "@/services/apiClient/hooks/useUpdateSemesterModules";
import { getChatSelectionState } from "@/components/util/useChatSelection";
import { OnDragEndResponder, OnDragStartResponder } from "@hello-pangea/dnd";
import { useModulesInScope } from "@/components/util/useModulesInScope";
import { useMessages } from "./useMessages";
import { useSemestersList } from "../SemestersList/useSemestersList";

/**
 * keeps track of what module is currently being dragged, and updates the study plan when a drag has been completed.
 */
export function useDragDropContext() {
  const { showInfoMessage } = useMessages();

  const { modules } = useModulesInScope();

  const studyPlan = useStudyPlan();

  const updateSemesterModule = useUpdateSemesterModule();

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

      const body = studyPlan.data.semesters.reduce<UpdateSemesterModuleInput>(
        (acc, semester) => {
          acc[semester.id] = semester.modules;

          if (semester.id === targetSemester) {
            // add the module to the semester it was dragged into
            acc[semester.id][targetCategory].push({
              moduleId: draggedModule.id,
            });
          }
          if (semester.id === sourceSemester) {
            // remove the module from the semester it was dragged out of
            acc[semester.id][sourceCategory] = acc[semester.id][
              sourceCategory
            ].filter((i) => i.moduleId !== draggedModule.id);
          }
          return acc;
        },
        {}
      );
      updateSemesterModule.mutate(body);
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
