import { Semester, modules } from "@/app/useSemesters";
import { Flex, Typography } from "antd";
import ModulesListSection from "./ModulesListSection";
import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { useChatSelection } from "@/useChatSelection";

export interface SemesterProps {
  semester: Semester;
  isDragging?: boolean;
}
export default function SemesterCard({
  semester,
  isDragging = false,
}: SemesterProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    isDraggingChats,
    draggedModules,
    actions: { setMouseUpInboxId, setHoveredInboxId },
  } = useChatSelection();

  const showActions = isHovered && !isDraggingChats;

  return (
    <Flex
      vertical
      key={semester.id}
      style={{ width: "28rem", height: "100%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Droppable
        droppableId={`droppable:semester:${semester.id}:standartAssessments:header`}
      >
        {(provided) => {
          return (
            <Typography.Title
              ref={provided.innerRef}
              {...provided.droppableProps}
              level={4}
              onMouseUp={() =>
                setMouseUpInboxId(
                  `droppable:semester:${semester.id}:standartAssessments`
                )
              }
              onMouseEnter={() =>
                setHoveredInboxId(
                  `droppable:semester:${semester.id}:standartAssessments`
                )
              }
              onMouseLeave={() => setHoveredInboxId(null)}
            >
              {semester.title}
            </Typography.Title>
          );
        }}
      </Droppable>
      <ModulesListSection
        disabled={
          isDraggingChats && draggedModules[0]?.allowEarlyAssessment === false
        }
        droppableId={`droppable:semester:${semester.id}:earlyAssessments`}
        title="Early Assessments"
        modules={semester.modules.earlyAssessments.map(
          (i) => modules[i.moduleId as keyof typeof modules]!
        )}
        showAddItemButton={showActions}
        onAddItem={() => {}}
      />
      <ModulesListSection
        droppableId={`droppable:semester:${semester.id}:standartAssessments`}
        title="Standart Assessments"
        modules={semester.modules.standartAssessments.map(
          (i) => modules[i.moduleId as keyof typeof modules]!
        )}
        showAddItemButton={showActions}
        onAddItem={() => {}}
      />
      <ModulesListSection
        disabled={
          isDraggingChats &&
          draggedModules[0]?.allowAlternativeAssessment === false
        }
        droppableId={`droppable:semester:${semester.id}:alternativeAssessments`}
        title="Alternative Assessments"
        modules={semester.modules.alternativeAssessments.map(
          (i) => modules[i.moduleId as keyof typeof modules]!
        )}
        showAddItemButton={showActions}
        onAddItem={() => {}}
      />
      <ModulesListSection
        droppableId={`droppable:semester:${semester.id}:reassessments`}
        title="Reassessments"
        modules={semester.modules.reassessments.map(
          (i) => modules[i.moduleId as keyof typeof modules]!
        )}
        showAddItemButton={showActions}
        onAddItem={() => {}}
      />

      <Droppable
        droppableId={`droppable:semester:${semester.id}:standartAssessments:footer`}
      >
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ height: "100%" }}
              onMouseUp={() =>
                setMouseUpInboxId(
                  `droppable:semester:${semester.id}:standartAssessments`
                )
              }
              onMouseEnter={() =>
                setHoveredInboxId(
                  `droppable:semester:${semester.id}:standartAssessments`
                )
              }
              onMouseLeave={() => setHoveredInboxId(null)}
            />
          );
        }}
      </Droppable>
    </Flex>
  );
}
