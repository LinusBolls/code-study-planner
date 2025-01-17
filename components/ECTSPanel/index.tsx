import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Statistic, Switch, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { LP } from "code-university";

import { SemesterModule } from "@/components/util/types";
import { getDepartment } from "@/data/departments";

import ECTSProgress, { ECTSProgressStep } from "../ECTSProgress";
import StatusCard from "./StatusCard";
import StatusText from "./StatusText";
import StudyProgramLegend from "./StudyProgramLegend";

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
    color: getDepartment(module.module.departmentId)?.color ?? "#000000",
    isWeak: !isFinished,
  };
};

export interface ECTSPanelProps {
  myModuleData?: LP.MyStudyData | null;
  modules: SemesterModule[];
  averageGrade: number;
  isLoading?: boolean;

  previewStudyPlan: boolean;
  onPreviewStudyPlanChange: (value: boolean) => void;
}
export default function ECTSPanel({
  myModuleData,
  modules,
  averageGrade,
  isLoading = false,
  previewStudyPlan,
  onPreviewStudyPlanChange,
}: ECTSPanelProps) {
  if (isLoading)
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
        align="center"
      >
        <Typography style={{ paddingTop: "5rem" }}>Loading...</Typography>
      </Flex>
    );

  const totalOrientationECTSNeeded =
    myModuleData?.orientation.totalECTSNeeded ?? 0;

  const totalOrientationECTS = myModuleData?.orientation.collectedECTS ?? 0;

  const hasCompletedOrientation =
    totalOrientationECTS >= totalOrientationECTSNeeded;

  const totalCoreECTSNeeded =
    (myModuleData?.mandatory.totalECTSNeeded ?? 0) +
    (myModuleData?.compulsoryElective.totalECTSNeeded ?? 0) +
    (myModuleData?.elective.totalECTSNeeded ?? 0) +
    (myModuleData?.sts.totalECTSNeeded ?? 0);

  const totalCoreECTS = modules.reduce(
    (acc, module) =>
      module.module != null &&
      !module.module.moduleIdentifier?.startsWith("OS_") &&
      !isFailed(module) &&
      !(!previewStudyPlan && module.type === "planned")
        ? acc + module.module.ects
        : acc,
    0,
  );

  const hasCompletedCore = totalCoreECTS >= totalCoreECTSNeeded;

  const totalSynthesisECTSNeeded =
    (myModuleData?.thesis.totalECTSNeeded ?? 0) +
    (myModuleData?.capstone.totalECTSNeeded ?? 0);

  const totalSynthesisECTS =
    (myModuleData?.thesis.collectedECTS ?? 0) +
    (myModuleData?.capstone.collectedECTS ?? 0);

  const hasCompletedSynthesis = totalSynthesisECTS >= totalSynthesisECTSNeeded;

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
      <Flex vertical>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Preview your study plan
        </Typography.Title>
        <Switch
          style={{ width: "fit-content" }}
          onChange={onPreviewStudyPlanChange}
          value={previewStudyPlan}
        />
      </Flex>
      <StudyProgramLegend />
      <StatusCard
        status={hasCompletedOrientation ? "success" : undefined}
        disabled={hasCompletedOrientation}
        title={
          <>
            Orientation Semester
            <Button
              type="link"
              href="https://www.notion.so/codeuniversitywiki/Orientation-Semester-dd5226207b1440ddac7cb2338269ff5e"
              target="_blank"
              icon={<InfoCircleOutlined style={{ fontSize: "14px" }} />}
              style={{
                color: hasCompletedOrientation
                  ? "rgba(0, 0, 0, 0.45)"
                  : "rgba(0, 0, 0, 0.88)",
              }}
            />
          </>
        }
        extra={
          <StatusText
            strong
            status={hasCompletedOrientation ? "success" : "error"}
          >
            {totalOrientationECTS} / {totalOrientationECTSNeeded} ECTS
          </StatusText>
        }
      >
        <ECTSProgress
          title="Orientation Semester"
          steps={modules
            .filter(
              (module) =>
                module.module != null &&
                !isFailed(module) &&
                module.module.shortCode.startsWith("OS_") &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.orientation.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={hasCompletedOrientation}
        />
      </StatusCard>
      <StatusCard
        status={hasCompletedCore ? "success" : undefined}
        disabled={hasCompletedCore}
        // title="Core Semesters"
        extra={
          <StatusText strong status={hasCompletedCore ? "success" : "error"}>
            {totalCoreECTS} / {totalCoreECTSNeeded} ECTS
          </StatusText>
        }
        title={
          <>
            Core Semesters
            <Button
              type="link"
              href="https://www.notion.so/codeuniversitywiki/Core-Semester-0a4e8d50d1514fe2b219e13785d21124"
              target="_blank"
              icon={<InfoCircleOutlined style={{ fontSize: "14px" }} />}
              style={{
                color: hasCompletedCore
                  ? "rgba(0, 0, 0, 0.45)"
                  : "rgba(0, 0, 0, 0.88)",
              }}
            />
          </>
        }
      >
        <ECTSProgress
          title="Mandatory Modules"
          steps={modules
            .filter(
              (module) =>
                module.module != null &&
                !isFailed(module) &&
                module.module.isMandatory &&
                !module.module.shortCode.startsWith("OS_") &&
                !module.module.shortCode.startsWith("BA_") &&
                module.module.departmentId !== "STS" &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.mandatory.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={hasCompletedCore}
        />
        <ECTSProgress
          title="Compulsory Elective Modules"
          steps={modules
            .filter(
              (module) =>
                module.module != null &&
                !isFailed(module) &&
                module.module.isCompulsoryElective &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.compulsoryElective.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={hasCompletedCore}
        />
        <ECTSProgress
          title="Elective Modules"
          steps={modules
            .filter(
              (module) =>
                module.module != null &&
                !isFailed(module) &&
                !(
                  module.module.isMandatory ||
                  module.module.isCompulsoryElective
                ) &&
                !module.module.shortCode.startsWith("OS_") &&
                !module.module.shortCode.startsWith("BA_") &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.elective.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={hasCompletedCore}
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
                module.module.departmentId === "STS" &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.sts.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={hasCompletedCore}
        />
      </StatusCard>
      <StatusCard
        title={
          <>
            Synthesis Semesters
            <Button
              type="link"
              href="https://www.notion.so/codeuniversitywiki/Synthesis-Semester-5a16d9427c4942f7813ce10648e0ad52"
              target="_blank"
              icon={<InfoCircleOutlined style={{ fontSize: "14px" }} />}
              style={{
                color: !hasCompletedCore
                  ? "rgba(0, 0, 0, 0.45)"
                  : "rgba(0, 0, 0, 0.88)",
              }}
            />
          </>
        }
        extra={
          <StatusText
            strong
            status={hasCompletedSynthesis ? "success" : "error"}
          >
            {totalSynthesisECTS} / {totalSynthesisECTSNeeded} ECTS
          </StatusText>
        }
        disabled={!hasCompletedCore}
      >
        <ECTSProgress
          title="Thesis"
          steps={modules
            .filter(
              (module) =>
                module.module != null &&
                !isFailed(module) &&
                module.module.shortCode.startsWith("BA_02") &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.thesis.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={!hasCompletedCore}
        />
        <ECTSProgress
          title="Capstone Project"
          steps={modules
            .filter(
              (module) =>
                module.module != null &&
                !isFailed(module) &&
                module.module.shortCode.startsWith("BA_01") &&
                !(!previewStudyPlan && module.type === "planned"),
            )
            .map(toStep)}
          max={myModuleData?.capstone.totalECTSNeeded ?? 0}
          isRequired={true}
          disabled={!hasCompletedCore}
        />
      </StatusCard>
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
          make up around half of your final bachelor&apos;s grade, because they
          get weighted three times their ECTS value
        </Link>
        .
      </Typography>
      <Typography>
        Pass / Fail modules don&apos;t get counted towards your bachelor&apos;s
        grade at all.
      </Typography>
    </Flex>
  );
}
