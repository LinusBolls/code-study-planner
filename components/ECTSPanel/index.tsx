import { Divider, Flex, Statistic, Typography } from "antd";
import ECTSProgress, { ECTSProgressStep } from "../ECTSProgress";
import { SemesterModule } from "@/components/util/types";
import { getDepartment } from "@/data/departments";
import Link from "antd/es/typography/Link";

const isFailed = (module: SemesterModule) => {
  return (
    module.type === "past" &&
    module.assessment.published &&
    !module.assessment.passed
  );
};

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
  const totalEcts = modules.reduce(
    (acc, module) =>
      module.module != null && !isFailed(module)
        ? acc + module.module.ects
        : acc,
    0
  );

  return (
    <Flex
      vertical
      gap="middle"
      style={{
        maxWidth: "32rem",
        height: "calc(100vh - 10rem)",
        padding: "1rem 1.5rem 1rem 1.5rem",
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
            Interaction Design
          </Typography.Text>
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

              backgroundColor: "#FF4473",
            }}
          />
          <Typography.Text>Software Engineering</Typography.Text>
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
      <Statistic title="Total" value={totalEcts + " ECTS"} />
      <ECTSProgress
        title="Orientation Semester"
        steps={modules
          .filter(
            (module) =>
              module.module != null &&
              !isFailed(module) &&
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
              !isFailed(module) &&
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
              !isFailed(module) &&
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
              !isFailed(module) &&
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
              !isFailed(module) &&
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
        Please keep in mind that your thesis and capstone combined{" "}
        <Link
          href="https://www.notion.so/codeuniversitywiki/Determination-of-Final-Grade-8e0be16695934a44bf3ba0a4c4c0bedd"
          target="_blank"
        >
          make up around half of your final bachelor&apos;s grade
        </Link>
        .
      </Typography>
    </Flex>
  );
}
