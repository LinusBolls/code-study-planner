import { Button, Flex, Typography } from "antd";
import { useEffect, useRef } from "react";
import { Panel } from "react-resizable-panels";

import { Semester } from "@/components/util/types";
import { useChatSelection } from "@/components/util/useChatSelection";

import SemesterCard from "../Semester";
import SemestersListSkeletonLoader from "./SemestersListSkeletonLoader";

export interface SemestersListProps {
  isLoading?: boolean;

  semesters: Semester[];

  isZoomedOut?: boolean;
}
export default function SemestersList({
  semesters,
  isLoading = false,
  isZoomedOut = false,
}: SemestersListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const scaleFactor =
    (containerRef.current?.offsetWidth ?? 0) /
    (childRef.current?.scrollWidth ?? 0);

  const {
    hoveredInboxId,
    isDraggingChats,
    draggedModules,
    setMouseUpInboxId,
    setHoveredInboxId,
  } = useChatSelection();

  const activeSemesterIdx = semesters.findIndex((i) => i.isActive);

  useEffect(() => {
    if (
      !isLoading &&
      childRef.current &&
      containerRef.current &&
      activeSemesterIdx !== -1
    ) {
      const currentSemester = childRef.current.children[activeSemesterIdx] as
        | HTMLElement
        | undefined;

      const listPadding = 24;

      const scrollX = (currentSemester?.offsetLeft ?? 0) - listPadding;

      containerRef.current.scrollBy(scrollX, 0);
    }
  }, [isLoading, activeSemesterIdx]);

  return (
    <Panel>
      {/* <Anchor
      getContainer={() => document.getElementById("main")!}
      direction="horizontal"
      items={semesters.map((i) => ({
        key: i.id,
        href: "#" + i.id,
        title: i.title,
      }))}
    /> */}
      <Flex
        ref={containerRef}
        style={{
          position: "relative",
          overflow: "scroll",
          height: "100%",
          // backgroundColor: "#F9F8F7",
        }}
      >
        <Flex
          style={{
            position: "absolute",
          }}
        >
          <Typography.Title level={3} style={{ margin: "1rem" }}>
            Semesters
          </Typography.Title>
        </Flex>
        <Flex
          ref={childRef}
          id="main"
          gap="2rem"
          style={{
            padding: "1.5rem",
            minWidth:
              !isLoading && Object.values(semesters).length === 0
                ? "100%"
                : undefined,
            ...(isZoomedOut
              ? {
                  transformOrigin: "top left",
                  transform: `scale(${scaleFactor})`,
                }
              : {}),
          }}
        >
          {isLoading && <SemestersListSkeletonLoader />}
          {!isLoading && Object.values(semesters).length === 0 && (
            <Typography.Text
              type="secondary"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",

                width: "100%",
                gap: "1rem",
              }}
            >
              Failed to load semesters, this isn&apos;t supposed to happen.
              Please try refreshing the page.{" "}
              <Button onClick={() => window.location.reload()}>Refresh</Button>
            </Typography.Text>
          )}
          {Object.values(semesters).map((semester, idx) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              offsetToCurrentSemester={idx - activeSemesterIdx}
              hoveredSection={
                hoveredInboxId?.includes(semester.id)
                  ? hoveredInboxId.split(":")[
                      hoveredInboxId.split(":").length - 1
                    ]
                  : null
              }
              draggedModules={draggedModules}
              setMouseUpInboxId={setMouseUpInboxId}
              setHoveredInboxId={setHoveredInboxId}
              isLoading={isLoading}
            />
          ))}
        </Flex>
      </Flex>
    </Panel>
  );
}
