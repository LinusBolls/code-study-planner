import { Module, Semester } from "@/app/useSemesters";
import { Flex, Typography } from "antd";
import ModulesListSection from "./ModulesListSection";
import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { useChatSelection } from "@/useChatSelection";

const getOffsetText = (offset: number) => {
  if (offset === 0) {
    return "Current semester";
  }
  if (offset === 1) {
    return "Next semester";
  }
  if (offset === -1) {
    return "6 months ago";
  }
  if (offset === 2) {
    return `In 1 year`;
  }
  if (offset === -2) {
    return `1 year ago`;
  }
  if (offset > 0) {
    return `In ${offset / 2} years`;
  }
  if (offset < 0) {
    return `${Math.abs(offset) / 2} years ago`;
  }
};

export interface SemesterProps {
  semester: Semester;
  offsetToCurrentSemester?: number;
}
export default function SemesterCard({
  semester,
  offsetToCurrentSemester = 0,
}: SemesterProps) {
  const [isHovered, setIsHovered] = useState(false);

  console.log("rendering semester:", semester.id);

  const {
    hoveredInboxId,
    isDraggingChats,
    draggedModules,
    setMouseUpInboxId,
    setHoveredInboxId,
  } = useChatSelection();

  const isPastSemester = offsetToCurrentSemester < 0;

  const showActions = isHovered && !isDraggingChats && !isPastSemester;

  return (
    <Flex
      id={semester.id}
      vertical
      key={semester.id}
      style={{ width: "28rem", height: "100%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Droppable
        droppableId={`droppable:semester:${semester.id}:standartAssessments:header`}
        isDropDisabled={isPastSemester}
      >
        {(provided) => {
          return (
            <Flex
              vertical
              style={{ height: "3.75rem !important" }}
              justify="flex-end"
            >
              <Typography.Text
                type="secondary"
                style={{ lineHeight: "0.75rem", fontSize: "0.75rem" }}
              >
                {getOffsetText(offsetToCurrentSemester)}
              </Typography.Text>
              <Typography.Title
                ref={provided.innerRef}
                {...provided.droppableProps}
                level={4}
                style={{
                  marginTop: 0,
                }}
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
            </Flex>
          );
        }}
      </Droppable>
      <ModulesListSection
        disabled={
          (isDraggingChats &&
            draggedModules[0]?.allowEarlyAssessment === false) ||
          isPastSemester
        }
        droppableId={`droppable:semester:${semester.id}:earlyAssessments`}
        onMouseUp={() =>
          setMouseUpInboxId(
            `droppable:semester:${semester.id}:earlyAssessments`
          )
        }
        onMouseEnter={() =>
          setHoveredInboxId(
            `droppable:semester:${semester.id}:earlyAssessments`
          )
        }
        onMouseLeave={() => setHoveredInboxId(null)}
        isHovered={
          hoveredInboxId ===
          `droppable:semester:${semester.id}:earlyAssessments`
        }
        isDragInProgress={isDraggingChats}
        title="Early Assessments"
        modules={semester.modules.earlyAssessments}
        showAddItemButton={showActions}
        onAddItem={() => {}}
      />
      <ModulesListSection
        droppableId={`droppable:semester:${semester.id}:standartAssessments`}
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
        isHovered={
          hoveredInboxId ===
          `droppable:semester:${semester.id}:standartAssessments`
        }
        isDragInProgress={isDraggingChats}
        title="Standart Assessments"
        modules={semester.modules.standartAssessments}
        showAddItemButton={showActions}
        onAddItem={() => {}}
        disabled={isPastSemester}
      />
      <ModulesListSection
        disabled={
          (isDraggingChats &&
            draggedModules[0]?.allowAlternativeAssessment === false) ||
          isPastSemester
        }
        droppableId={`droppable:semester:${semester.id}:alternativeAssessments`}
        onMouseUp={() =>
          setMouseUpInboxId(
            `droppable:semester:${semester.id}:alternativeAssessments`
          )
        }
        onMouseEnter={() =>
          setHoveredInboxId(
            `droppable:semester:${semester.id}:alternativeAssessments`
          )
        }
        onMouseLeave={() => setHoveredInboxId(null)}
        isHovered={
          hoveredInboxId ===
          `droppable:semester:${semester.id}:alternativeAssessments`
        }
        isDragInProgress={isDraggingChats}
        title="Alternative Assessments"
        modules={semester.modules.alternativeAssessments}
        showAddItemButton={showActions}
        onAddItem={() => {}}
      />
      <ModulesListSection
        droppableId={`droppable:semester:${semester.id}:reassessments`}
        onMouseUp={() =>
          setMouseUpInboxId(`droppable:semester:${semester.id}:reassessments`)
        }
        onMouseEnter={() =>
          setHoveredInboxId(`droppable:semester:${semester.id}:reassessments`)
        }
        onMouseLeave={() => setHoveredInboxId(null)}
        isHovered={
          hoveredInboxId === `droppable:semester:${semester.id}:reassessments`
        }
        isDragInProgress={isDraggingChats}
        title="Reassessments"
        modules={semester.modules.reassessments}
        showAddItemButton={showActions}
        onAddItem={() => {}}
        disabled={isPastSemester}
      />

      <Droppable
        droppableId={`droppable:semester:${semester.id}:standartAssessments:footer`}
        isDropDisabled={isPastSemester}
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
