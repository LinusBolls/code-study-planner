import { Flex } from "antd";
import { Panel } from "react-resizable-panels";
import SemestersListSkeletonLoader from "./SemestersListSkeletonLoader";
import { Semester } from "@/app/useSemesters";
import SemesterCard from "../Semester";
import { useRef } from "react";
import { useChatSelection } from "@/useChatSelection";

export interface SemestersListProps {
  semestersQuery: {
    isLoading: boolean;
  };
  semesters: Semester[];

  isZoomedOut?: boolean;
}
export default function SemestersList({
  semestersQuery,
  semesters,

  isZoomedOut = false,
}: SemestersListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const scaleFactor =
    (containerRef.current?.offsetWidth ?? 0) /
    (childRef.current?.scrollWidth ?? 0);

  console.log(
    "scale",
    containerRef.current?.offsetWidth,
    childRef.current?.scrollWidth,
    scaleFactor
  );

  const {
    hoveredInboxId,
    isDraggingChats,
    draggedModules,
    setMouseUpInboxId,
    setHoveredInboxId,
  } = useChatSelection();

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
          {semestersQuery.isLoading && <SemestersListSkeletonLoader />}
          {Object.values(semesters).map((semester, idx) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              offsetToCurrentSemester={idx - 5}
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
