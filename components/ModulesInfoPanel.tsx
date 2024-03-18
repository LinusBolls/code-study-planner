import { Flex, Typography } from "antd";
import ECTSProgress from "./ECTSProgress";

export interface ModulesInfoPanelProps {}
export default function ModulesInfoPanel({}: ModulesInfoPanelProps) {
  return (
    <Flex
      vertical
      gap="middle"
      style={{
        height: "calc(100vh - 6rem)",
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
          <Typography.Text>STS</Typography.Text>
        </Flex>
      </div>
      <ECTSProgress
        title="Orientation Semester"
        steps={[
          {
            id: "0",
            title: "Software Development Basics - 4 ECTS",
            value: 4,
            color: "#35DAAD",
          },
          {
            id: "1",
            title: "Software Development Basics - 4 ECTS",
            value: 4,
            color: "#FF4473",
          },
          {
            id: "2",
            title: "Software Development Basics - 4 ECTS",
            value: 4,
            color: "#4059AD",
          },
          {
            id: "3",
            title: "Software Development Basics - 4 ECTS",
            value: 4,
            color: "#FEDD9A",
          },
          {
            id: "4",
            title: "Software Development Basics - 8 ECTS",
            value: 8,
            color: "#FEDD9A",
          },
        ]}
        max={24}
      />
      <ECTSProgress
        title="Mandatory Modules"
        steps={[
          {
            id: "0",
            title: "Software Development Basics - 5 ECTS",
            value: 5,
            color: "#FF4473",
          },
        ]}
        max={40}
      />
      <ECTSProgress title="Compulsory Elective Modules" steps={[]} max={10} />
      <ECTSProgress
        title="Elective Modules"
        steps={[
          {
            id: "0",
            title: "Web Technologies Basics - 5 ECTS",
            value: 5,
            color: "#FF4473",
          },
          {
            id: "1",
            title: "Web Frontend Technologies - 5 ECTS",
            value: 5,
            color: "#FF4473",
          },
          {
            id: "2",
            title: "Web Backend Technologies - 5 ECTS",
            value: 5,
            color: "#FF4473",
          },
          {
            id: "3",
            title: "Mobile Development - 5 ECTS",
            value: 5,
            color: "#FF4473",
          },
        ]}
        max={50}
      />
      <ECTSProgress title="Mandatory STS Modules" steps={[]} max={26} />
      <ECTSProgress title="Thesis" steps={[]} max={15} />
      <ECTSProgress title="Capstone Project" steps={[]} max={15} />
    </Flex>
  );
}
