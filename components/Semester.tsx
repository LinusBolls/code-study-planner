import { Module, Semester } from "@/components/util/types";
import { Flex, Row, Typography } from "antd";
import ModulesListSection from "./ModulesListSection";
import { memo, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { getRelativeSemesterTime } from "@/services/learningPlatform/mapping";

// feature flag
const ADD_ITEM_BUTTON = false;

export interface SemesterProps {
  semester: Semester;
  offsetToCurrentSemester?: number;
  hoveredSection?: string | null;

  draggedModules: Module[];

  setMouseUpInboxId: (inboxId: string | null) => void;
  setHoveredInboxId: (inboxId: string | null) => void;
}
function SemesterCard({
  semester,
  offsetToCurrentSemester = 0,
  hoveredSection,
  draggedModules,
  setMouseUpInboxId,
  setHoveredInboxId,
}: SemesterProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isPastSemester = offsetToCurrentSemester < 0;

  const isFutureSemester = offsetToCurrentSemester > 0;

  const isDraggingChats = draggedModules.length > 0;

  const showActions = ADD_ITEM_BUTTON && isHovered && !isDraggingChats;

  const totalEcts = Object.values(semester.modules)
    .flat()
    .reduce((acc, i) => {
      if (
        (i.assessment?.published && !i.assessment?.passed) ||
        i.module == null
      )
        return acc;

      return acc + i.module.ects;
    }, 0);

  const isEarlyDisabled =
    semester.modules.earlyAssessments.some(
      (i) => i.module?.moduleId === draggedModules[0]?.moduleId
    ) ||
    (!semester.canRegisterForEarlyAssessments && !isFutureSemester);

  const isStandartDisabled =
    semester.modules.standartAssessments.some(
      (i) => i.module?.moduleId === draggedModules[0]?.moduleId
    ) ||
    (!semester.canRegisterForStandardAssessments && !isFutureSemester);

  const isAlternativeDisabled =
    semester.modules.alternativeAssessments.some(
      (i) => i.module?.moduleId === draggedModules[0]?.moduleId
    ) ||
    (!semester.canRegisterForAlternativeAssessments && !isFutureSemester);

  const isReassessmentDisabled =
    semester.modules.reassessments.some(
      (i) => i.module?.moduleId === draggedModules[0]?.moduleId
    ) ||
    (!semester.canRegisterForReassessments && !isFutureSemester);

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
        isDropDisabled={isPastSemester || isStandartDisabled}
      >
        {(provided) => {
          return (
            <>
              {provided.placeholder}
              <Flex
                vertical
                style={{ height: "3.75rem !important" }}
                justify="flex-end"
              >
                <Typography.Text
                  type="secondary"
                  style={{ lineHeight: "0.75rem", fontSize: "0.75rem" }}
                >
                  {getRelativeSemesterTime(offsetToCurrentSemester)}
                </Typography.Text>
                <Row align="middle">
                  <Typography.Title
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    level={4}
                    style={{
                      margin: 0,
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
                  <Typography.Text
                    type="secondary"
                    style={{
                      lineHeight: "0.75rem",
                      fontSize: "0.75rem",
                      whiteSpace: "pre",
                    }}
                  >
                    {" "}
                    • {totalEcts} ECTS
                  </Typography.Text>
                </Row>
              </Flex>
            </>
          );
        }}
      </Droppable>
      <ModulesListSection
        disabled={
          (isDraggingChats &&
            draggedModules[0]?.allowEarlyAssessment === false) ||
          isPastSemester ||
          isEarlyDisabled
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
        isHovered={hoveredSection === "earlyAssessments"}
        isDragInProgress={isDraggingChats}
        title="Early Assessments"
        modules={semester.modules.earlyAssessments}
        showAddItemButton={showActions && !isEarlyDisabled}
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
        isHovered={hoveredSection === "standartAssessments"}
        isDragInProgress={isDraggingChats}
        title="Standard Assessments"
        modules={semester.modules.standartAssessments}
        showAddItemButton={showActions && !isStandartDisabled}
        onAddItem={() => {}}
        disabled={isPastSemester || isStandartDisabled}
      />
      <ModulesListSection
        disabled={
          (isDraggingChats &&
            draggedModules[0]?.allowAlternativeAssessment === false) ||
          isPastSemester ||
          isAlternativeDisabled
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
        isHovered={hoveredSection === "alternativeAssessments"}
        isDragInProgress={isDraggingChats}
        title="Alternative Assessments"
        modules={semester.modules.alternativeAssessments}
        showAddItemButton={showActions && !isAlternativeDisabled}
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
        isHovered={hoveredSection === "reassessments"}
        isDragInProgress={isDraggingChats}
        title="Reassessments"
        modules={semester.modules.reassessments}
        showAddItemButton={showActions && !isReassessmentDisabled}
        onAddItem={() => {}}
        disabled={isPastSemester || isReassessmentDisabled}
      />

      <Droppable
        droppableId={`droppable:semester:${semester.id}:standartAssessments:footer`}
        isDropDisabled={isPastSemester || isStandartDisabled}
      >
        {(provided) => {
          return (
            <>
              {provided.placeholder}
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
            </>
          );
        }}
      </Droppable>
    </Flex>
  );
}
export default memo(SemesterCard);
