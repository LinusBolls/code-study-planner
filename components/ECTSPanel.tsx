import { Divider, Flex, Statistic, Typography } from "antd";
import ECTSProgress, { ECTSProgressStep } from "./ECTSProgress";
import { SemesterModule } from "@/app/useSemesters";
import { getDepartment } from "@/data/departments";

const toStep = (module: SemesterModule): ECTSProgressStep => {
  const isFinished = module.type === "past" && module.assessment.passed;

  return {
    id: module.id,
    title:
      module.module.shortCode +
      " " +
      module.module.title +
      " - " +
      module.module.ects +
      " ECTS",
    value: module.module.ects,
    color: getDepartment(module.module.departmentId)?.color ?? "#FFFFFF",
    isWeak: !isFinished,
  };
};

export interface ECTSPanelProps {
  modules: SemesterModule[];
  averageGrade: number;
}
export default function ECTSPanel({ modules, averageGrade }: ECTSPanelProps) {
  return (
    <Flex
      vertical
      gap="middle"
      style={{
        maxWidth: "32rem",
        height: "calc(100vh - 10rem)",
        padding: "1rem 1.5rem 0 1.5rem",
        overflowY: "scroll",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",

          rowGap: "0.25rem",
          columnGap: "1rem",
        }}
      >
        <Flex gap="small" align="center">
          <div
            style={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",

              backgroundColor: "#35DAAD",
            }}
          />
          <Typography.Text
            style={{
              fontSize: "0.875rem",
            }}
          >
            Software Engineering
          </Typography.Text>
        </Flex>
        <Flex gap="small" align="center">
          <div
            style={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",

              backgroundColor: "#FF4473",
            }}
          />
          <Typography.Text>Interaction Design</Typography.Text>
        </Flex>
        <Flex gap="small" align="center">
          <div
            style={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",

              backgroundColor: "#4059AD",
            }}
          />
          <Typography.Text>Product Management</Typography.Text>
        </Flex>
        <Flex gap="small" align="center">
          <div
            style={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",

              backgroundColor: "#FEDD9A",
            }}
          />
          <Typography.Text>STS, IS</Typography.Text>
        </Flex>
      </div>
      <ECTSProgress
        title="Orientation Semester"
        steps={modules
          .filter(
            (module) =>
              module.module != null &&
              !(module.type === "past" && !module.assessment.passed) &&
              module.module.shortCode.startsWith("OS_")
          )
          .map(toStep)}
        max={24}
      />
      <ECTSProgress
        title="Mandatory Modules"
        steps={modules
          .filter(
            (module) =>
              module.module != null &&
              !(module.type === "past" && !module.assessment.passed) &&
              module.module.isMandatory &&
              !module.module.shortCode.startsWith("OS_")
          )
          .map(toStep)}
        max={40}
      />
      <ECTSProgress
        title="Compulsory Elective Modules"
        steps={modules
          .filter(
            (module) =>
              module.module != null &&
              !(module.type === "past" && !module.assessment.passed) &&
              module.module.isCompulsoryElective
          )
          .map(toStep)}
        max={10}
      />
      <ECTSProgress
        title="Elective Modules"
        steps={modules
          .filter(
            (module) =>
              module.module != null &&
              !(module.type === "past" && !module.assessment.passed) &&
              !(module.module.isMandatory || module.module.isCompulsoryElective)
          )
          .map(toStep)}
        max={50}
      />
      <ECTSProgress
        title="Mandatory STS Modules"
        steps={modules
          .filter(
            (module) =>
              module.module != null &&
              !(module.type === "past" && !module.assessment.passed) &&
              (module.module.isMandatory ||
                module.module.isCompulsoryElective) &&
              module.module.departmentId === "STS"
          )
          .map(toStep)}
        max={26}
      />
      <ECTSProgress title="Thesis" steps={[]} max={15} />
      <ECTSProgress title="Capstone Project" steps={[]} max={15} />
      <Divider />
      <Statistic
        title="Average grade based on your modules"
        value={averageGrade}
        precision={1}
      />
      <Typography>
        Please keep in mind that your thesis and capstone combined make up
        around half of your final bachelor&apos;s grade.
      </Typography>
    </Flex>
  );
}
