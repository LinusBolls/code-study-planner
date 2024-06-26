import { Flex } from "antd";
import { Panel } from "react-resizable-panels";
import SemestersListSkeletonLoader from "./SemestersListSkeletonLoader";
import { Semester } from "@/components/util/types";
import SemesterCard from "../Semester";
import { useEffect, useRef } from "react";
import { useChatSelection } from "@/components/util/useChatSelection";

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
          overflow: "scroll",
          height: "100%",
          // backgroundColor: "#F9F8F7",
        }}
      >
        <Flex
          ref={childRef}
          id="main"
          gap="2rem"
          style={{
            padding: "1.5rem",
            ...(isZoomedOut
              ? {
                  transformOrigin: "top left",
                  transform: `scale(${scaleFactor})`,
                }
              : {}),
          }}
        >
          {isLoading && <SemestersListSkeletonLoader />}
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
            />
          ))}
        </Flex>
      </Flex>
    </Panel>
  );
}
