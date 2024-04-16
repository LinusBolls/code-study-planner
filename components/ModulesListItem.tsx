import { Assessment, Module } from "@/app/useSemesters";
import { getDepartment } from "@/data/departments";
import { useIsDraggingChats } from "@/useChatSelection";
import { HolderOutlined } from "@ant-design/icons";
import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import {
  Card,
  CardProps,
  Flex,
  Popover,
  Skeleton,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";

export interface ModulesListItemProps extends CardProps {
  module?: Module | null;
  draggableId?: string;
  index?: number;
  assessment?: Assessment | null;
}
export default function ModulesListItem({
  module,
  draggableId = "",
  index = 0,
  assessment,
  ...rest
}: ModulesListItemProps) {
  const isDraggingChats = useIsDraggingChats();

  const [isHovered, setIsHovered] = useState(false);
  const [isDragHandleHovered, setIsDragHandleHovered] = useState(false);

  if (!module) {
    return (
      <Card
        {...rest}
        style={{
          width: "100%",
          ...rest.style,
          // borderLeft: "0.25rem solid #F0F0F0",
          borderRadius: "0.25rem",
        }}
        styles={{
          body: {
            padding: "0.625rem 0.75rem",
          },
        }}
        size="small"
      >
        <Skeleton
          active
          paragraph={{
            rows: 1,
            style: {
              marginTop: "0.75rem",
            },
          }}
        />
      </Card>
    );
  }

  const departmentColor =
    getDepartment(module.departmentId)?.color ?? "#000000";

  return (
    <Popover
      placement="leftTop"
      style={{ width: 512 }}
      content={
        <div>
          <Link href={module.registerUrl}>Register</Link>
        </div>
      }
      title={module.shortCode + " " + module.title}
      trigger="hover"
      open={isHovered && !isDragHandleHovered && !isDraggingChats}
    >
      {assessment != null ? (
        <div>
          <InnerModulesListItem
            isHovered={isHovered}
            isDragHandleHovered={isDragHandleHovered}
            setIsHovered={setIsHovered}
            setIsDragHandleHovered={setIsDragHandleHovered}
            module={module}
            departmentColor={departmentColor}
            assessment={assessment}
            isDragging={false}
            isDraggingChats={isDraggingChats}
            {...rest}
          />
        </div>
      ) : (
        <div>
          <Draggable index={index} draggableId={draggableId}>
            {(provided, { isDragging }) => (
              <InnerModulesListItem
                isDragging={isDragging}
                isHovered={isHovered}
                isDragHandleHovered={isDragHandleHovered}
                setIsHovered={setIsHovered}
                setIsDragHandleHovered={setIsDragHandleHovered}
                module={module}
                departmentColor={departmentColor}
                assessment={assessment}
                isDraggingChats={isDraggingChats}
                provided={provided}
                {...rest}
              />
            )}
          </Draggable>
        </div>
      )}
    </Popover>
  );
}

function InnerModulesListItem({
  provided,
  isDragging,
  isHovered,
  assessment,
  isDraggingChats,
  isDragHandleHovered,
  module,
  departmentColor,

  setIsHovered,
  setIsDragHandleHovered,
  ...rest
}: {
  isDragging: boolean;
  isHovered: boolean;
  isDragHandleHovered: boolean;
  module: Module;
  departmentColor: string;
  assessment?: Assessment | null;
  isDraggingChats: boolean;
  provided?: DraggableProvided;

  setIsHovered: (value: boolean) => void;
  setIsDragHandleHovered: (value: boolean) => void;
}) {
  return (
    <Flex
      {...provided?.draggableProps}
      ref={provided?.innerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
      style={{
        ...(rest.style ?? {}),
        paddingBottom: "0.5rem",
      }}
    >
      <Card
        style={{
          width: "100%",
          borderRadius: "0.25rem",
          transform: isDragging ? "rotate(-2deg)" : undefined,
          opacity: isDragging ? 0.8 : 1,
        }}
        styles={{
          body: {
            background:
              isHovered && assessment == null && !isDraggingChats
                ? isDragHandleHovered
                  ? "rgba(24, 144, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)"
                : undefined,
            padding: "0.5rem 0.75rem",
          },
        }}
        size="small"
      >
        <Flex>
          <Flex
            vertical
            gap="0.25rem"
            style={{
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Typography.Text
              type="secondary"
              style={{
                overflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Tag
                color={departmentColor}
                style={{
                  padding: "0 0.25rem",

                  border: "none",
                }}
              >
                {module.shortCode}
              </Tag>
              <Link target="_blank" href={module.url}>
                {module.title}
              </Link>
            </Typography.Text>

            <Flex gap="small" align="center">
              <Typography.Text
                type="secondary"
                style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                <Link target="_blank" href={module.coordinatorUrl}>
                  {module.coordinatorName}
                </Link>
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {module.ects} ECTS
              </Typography.Text>
              {module.isMandatory && (
                <Typography.Text
                  strong
                  style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  mandatory
                </Typography.Text>
              )}
              {module.isCompulsoryElective && (
                <Typography.Text
                  strong
                  style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  compulsory elective
                </Typography.Text>
              )}
              <Flex gap="0.25rem">
                {module.allowEarlyAssessment && (
                  <Tooltip title="Allows early assessment">
                    <span
                      title="Allows early assessment"
                      style={{
                        width: "fit-content",
                        padding: "0 0.25rem",
                        margin: 0,

                        border: "none",
                        background: "#E6E6E6",
                        color: "#5D5D5D",

                        fontSize: "0.625rem",
                        lineHeight: "0.875rem",
                        height: "0.875rem",
                        fontWeight: "bold",

                        borderRadius: "0.125rem",
                      }}
                    >
                      E
                    </span>
                  </Tooltip>
                )}
                {module.allowAlternativeAssessment && (
                  <Tooltip title="Allows alternative assessment">
                    <span
                      title="Allows alternative assessment"
                      style={{
                        width: "fit-content",
                        padding: "0 0.25rem",
                        margin: 0,

                        border: "none",
                        background: "#E6E6E6",
                        color: "#5D5D5D",

                        fontSize: "0.625rem",
                        lineHeight: "0.875rem",
                        height: "0.875rem",
                        fontWeight: "bold",

                        borderRadius: "0.125rem",
                      }}
                    >
                      A
                    </span>
                  </Tooltip>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            align="center"
            justify="end"
            style={{
              height: "3rem",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            }}
            onMouseEnter={() => setIsDragHandleHovered(true)}
            onMouseLeave={() => setIsDragHandleHovered(false)}
            {...provided?.dragHandleProps}
          >
            {assessment != null ? (
              <Flex
                vertical
                align="end"
                justify="space-between"
                style={{
                  height: "100%",
                }}
              >
                <Typography.Text
                  type="secondary"
                  style={{
                    overflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.75rem",
                  }}
                >
                  <Link target="_blank" href={assessment.assessorUrl}>
                    {assessment.assessorName}
                  </Link>
                </Typography.Text>
                <Tag
                  color={assessment.passed ? "green" : "red"}
                  style={{
                    padding: "0 0.25rem",

                    border: "none",
                    width: "fit-content",

                    margin: 0,
                  }}
                >
                  {module.isGraded
                    ? assessment.passed
                      ? `Level ${assessment.level}, Grade ${assessment.grade}`
                      : `Failed, Grade ${assessment.grade}`
                    : assessment.passed
                    ? "Passed"
                    : "Failed"}
                </Tag>
              </Flex>
            ) : (
              <HolderOutlined
                style={{
                  fontSize: "1.5rem",
                  color: isDragHandleHovered ? "#1890FF" : "rgba(0, 0, 0, 0.3)",
                }}
              />
            )}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
