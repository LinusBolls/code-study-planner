import { Module } from "@/app/useSemesters";
import { useChatSelection } from "@/useChatSelection";
import { ExpandAltOutlined, HolderOutlined } from "@ant-design/icons";
import { Draggable } from "@hello-pangea/dnd";
import { Button, Card, CardProps, Flex, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";

export interface ModulesListItemProps extends CardProps {
  module: Module;
  draggableId: string;
  index: number;
}
export default function ModulesListItem({
  module,
  draggableId,
  index,
  ...rest
}: ModulesListItemProps) {
  const { isDraggingChats } = useChatSelection();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable key={module.id} index={index} draggableId={draggableId}>
      {(provided, snapshot) => (
        <Flex
          {...provided.draggableProps}
          ref={provided.innerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card
            {...rest}
            style={{
              width: "100%",
              ...rest.style,
              borderLeft: "0.25rem solid #FF4473",
              borderRadius: "0.25rem",
              transform: snapshot.isDragging ? "rotate(-2deg)" : undefined,
              opacity: snapshot.isDragging ? 0.8 : 1,
            }}
            styles={{
              body: {
                background:
                  isHovered && !isDraggingChats ? "#F0F0F0" : undefined,
                padding: "0.5rem 0.75rem",
              },
            }}
            size="small"
          >
            {/* {isHovered && (
              <Flex
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "flex-end",

                  paddingRight: "1.25rem",
                }}
              >
                <Button type="default" icon={<ExpandAltOutlined />} />
              </Flex>
            )} */}
            <Flex>
              <Flex vertical gap="0.25rem">
                <Typography.Text
                  type="secondary"
                  style={{
                    overflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Link
                    href="#"
                    style={
                      {
                        // color,
                      }
                    }
                  >
                    ID_02 Generative Design
                  </Link>
                </Typography.Text>

                <Flex gap="small">
                  <Typography.Text
                    type="secondary"
                    style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    <Link
                      href="#"
                      style={
                        {
                          // color,
                        }
                      }
                    >
                      Martin Knobel
                    </Link>
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    10 ECTS
                  </Typography.Text>
                  <Typography.Text
                    strong
                    style={{ overflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    compulsory elective
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex
                align="center"
                justify="end"
                style={{
                  width: "100%",
                  height: "3rem",
                  paddingRight: "0.5rem",
                }}
                {...provided.dragHandleProps}
              >
                <HolderOutlined
                  style={{ fontSize: "1.5rem", color: "rgba(0, 0, 0, 0.3)" }}
                />
              </Flex>
            </Flex>
          </Card>
        </Flex>
      )}
    </Draggable>
  );
}
