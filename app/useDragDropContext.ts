import { useModulesInScope } from "@/components/SemestersList/useSemestersList";
import { UpdateSemesterModuleInput } from "@/services/apiClient";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import { useUpdateSemesterModule } from "@/services/apiClient/hooks/useUpdateSemesterModules";
import { getChatSelectionState } from "@/useChatSelection";
import { OnDragEndResponder, OnDragStartResponder } from "@hello-pangea/dnd";

/**
 * keeps track of what module is currently being dragged, and updates the study plan when a drag has been completed.
 */
export function useDragDropContext() {
  const { modules } = useModulesInScope();

  const studyPlan = useStudyPlan();

  const updateSemesterModule = useUpdateSemesterModule();

  const onDragStart: OnDragStartResponder = (e) => {
    const { startDraggingChats } = getChatSelectionState();

    const draggedModuleId = e.draggableId.split(":")[2];

    const draggedModule = modules.find((i) => i.id === draggedModuleId);

    if (draggedModule) {
      startDraggingChats([draggedModule], e.source.droppableId);
    } else {
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
