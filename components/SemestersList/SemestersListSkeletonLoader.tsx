import { Flex, Skeleton } from "antd";
import ModulesListSection from "../ModulesListSection";

export default function SemestersListSkeletonLoader() {
  return [1, 2, 3, 4, 5].map((_, idx) => (
    <Flex key={idx} vertical style={{ width: "28rem", height: "100%" }}>
      <Skeleton
        active
        paragraph={{
          rows: 1,
          style: {
            marginTop: "0.75rem",
            marginBottom: "0.375rem",
          },
        }}
      />
      <ModulesListSection
        disabled={true}
        droppableId="dummy"
        title="Early Assessments"
        modules={[].map((_, idx) => ({
          id: "dummy:" + idx,
          type: "planned",
          assessment: null,

          module: null as any,
        }))}
        showAddItemButton={false}
        onAddItem={() => {}}
      />
      <ModulesListSection
        disabled={true}
        droppableId="dummy"
        title="Standart Assessments"
        modules={[1, 2, 3, 4].map((_, idx) => ({
          id: "dummy:" + idx,
          type: "planned",
          assessment: null,

          module: null as any,
        }))}
        showAddItemButton={false}
        onAddItem={() => {}}
      />
      <ModulesListSection
        disabled={true}
        droppableId="dummy"
        title="Alternative Assessments"
        modules={[1].map((_, idx) => ({
          id: "dummy:" + idx,
          type: "planned",
          assessment: null,

          module: null as any,
        }))}
        showAddItemButton={false}
        onAddItem={() => {}}
      />
      <ModulesListSection
        disabled={true}
        droppableId="dummy"
        title="Reassessments"
        modules={[1].map((_, idx) => ({
          id: "dummy:" + idx,
          type: "planned",
          assessment: null,

          module: null as any,
        }))}
        showAddItemButton={false}
        onAddItem={() => {}}
      />
    </Flex>
  ));
}
