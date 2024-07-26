import { PlusOutlined } from "@ant-design/icons";
import { Droppable } from "@hello-pangea/dnd";
import { Button, Flex, FlexProps, Typography } from "antd";
import { memo } from "react";

import { SemesterModule } from "@/components/util/types";
import { theme } from "@/data/theme";

import ModulesListItem from "./ModulesListItem";

export interface ModulesListSectionProps extends Omit<FlexProps, "children"> {
  modules: SemesterModule[];
  droppableId: string;
  title?: string;
  disabled?: boolean;
  showAddItemButton?: boolean;
  isHovered?: boolean;
  isDragInProgress?: boolean;

  onAddItem?: () => void;
}
function ModulesListSection({
  title,
  modules,
  droppableId,
  disabled = false,
  showAddItemButton = true,
  isHovered = false,
  isDragInProgress = false,

  onAddItem,
  ...rest
}: ModulesListSectionProps) {
  const isDragTarget = isHovered && isDragInProgress && !disabled;

  return (
    <Droppable
      droppableId={droppableId}
      isDropDisabled={!isDragTarget}
      renderClone={(provided, _, rubric) => {
        const rowModule = modules[rubric.source.index].module;

        return (
          <ModulesListItem
            isClone
            module={rowModule}
            showPopoverOn="hover"
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          />
        );
      }}
    >
      {(provided) => (
        <Flex
          {...rest}
          vertical
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={
            disabled && isDragInProgress
              ? {
                  cursor: "not-allowed",
                }
              : {}
          }
        >
          <Flex
            gap="small"
            style={{
              height: "3rem",
              alignItems: "flex-end",
            }}
          >
            <Typography.Title
              level={5}
              disabled={isDragInProgress && disabled}
              style={{
                transition: "color 200ms",
                color: isDragTarget ? theme.palette.dndHighlight : undefined,
              }}
            >
              {title}
            </Typography.Title>
            {onAddItem && showAddItemButton && (
              <Button
                size="small"
                type="text"
                icon={<PlusOutlined />}
                onClick={onAddItem}
                style={{
                  color: "rgba(55, 53, 47, 0.5)",
                  marginBottom: "0.5rem",
                }}
              />
            )}
          </Flex>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              transition: "padding 200ms, border 200ms",
              borderRadius: "0.5rem",
              gap: "0.5rem",
              padding:
                !isDragTarget && !modules.length
                  ? "0 0.5rem"
                  : isDragTarget
                    ? "0.5rem 0.5rem 5rem 0.5rem"
                    : "0",
              ...(isDragTarget
                ? {
                    border: `1px dashed ${theme.palette.dndHighlight}`,
                  }
                : {}),
            }}
          >
            {provided.placeholder}
            {modules.map((module, index) => (
              <ModulesListItem
                key={module.id}
                module={module.module}
                assessment={module.assessment}
                index={index}
                draggableId={"draggable:semester-module:" + module.id}
                showPopoverOn="info-icon"
              />
            ))}
          </div>
        </Flex>
      )}
    </Droppable>
  );
}
export default memo(ModulesListSection);
