import { Droppable } from "@hello-pangea/dnd";
import { Button, Empty, Flex, Typography } from "antd";
import ModulesListItem from "./ModulesListItem";
import { PlusOutlined } from "@ant-design/icons";
import { Module } from "@/app/useSemesters";
import { useChatSelection } from "@/useChatSelection";
import { theme } from "@/data/theme";

export interface ModulesListSectionProps {
  title?: string;
  onAddItem?: () => void;
  modules: Module[];
  droppableId: string;
  showAddItemButton?: boolean;
  disabled?: boolean;
}
export default function ModulesListSection({
  disabled = false,
  title,
  onAddItem,
  modules,
  droppableId,
  showAddItemButton = true,
}: ModulesListSectionProps) {
  const {
    hoveredInboxId,
    isDraggingChats,
    actions: { setMouseUpInboxId, setHoveredInboxId },
  } = useChatSelection();

  const isDragTarget =
    hoveredInboxId === droppableId && isDraggingChats && !disabled;

  return (
    <Droppable
      droppableId={droppableId}
      isDropDisabled={hoveredInboxId !== droppableId || !isDragTarget}
      // ignoreContainerClipping={false}
      // isCombineEnabled={false}
    >
      {(provided) => (
        <Flex
          vertical
          ref={provided.innerRef}
          {...provided.droppableProps}
          onMouseUp={() => setMouseUpInboxId(droppableId)}
          onMouseEnter={() => setHoveredInboxId(droppableId)}
          onMouseLeave={() => setHoveredInboxId(null)}
          style={
            disabled
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
              disabled={disabled}
              style={{
                transition: "color 200ms",
                color: isDragTarget ? theme.palette.dndHighlight : undefined,
              }}
            >
              {title}
            </Typography.Title>
            {onAddItem && (
              <Button
                hidden={!showAddItemButton}
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
            {modules.map((module, index) => (
              <ModulesListItem
                key={module.id}
                module={module}
                index={index}
                draggableId={"draggable:semester-module:" + module.id}
              />
            ))}
          </div>
        </Flex>
      )}
    </Droppable>
  );
}
