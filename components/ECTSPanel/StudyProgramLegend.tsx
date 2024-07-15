import { getDepartment } from "@/data/departments";
import { Flex, Typography } from "antd";

export default function StudyProgramLegend() {
  return (
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

            backgroundColor: getDepartment("ID")!.color,
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

            backgroundColor: getDepartment("PM")!.color,
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

            backgroundColor: getDepartment("SE")!.color,
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

            backgroundColor: getDepartment("STS")!.color,
          }}
        />
        <Typography.Text>STS</Typography.Text>
      </Flex>
      <Flex gap="small" align="center">
        <div
          style={{
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "50%",

            backgroundColor: getDepartment("IS")!.color,
          }}
        />
        <Typography.Text>IS</Typography.Text>
      </Flex>
    </div>
  );
}
