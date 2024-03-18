import { Flex, Tooltip, Typography } from "antd";

export interface ECTSProgressProps {
  title: string;
  trackColor?: string;
  max: number;
  steps: {
    id: string;
    title: string;
    value: number;
    color: string;
  }[];
}
export default function ECTSProgress({
  title,
  trackColor = "#F0F0F0",
  max,
  steps,
}: ECTSProgressProps) {
  const stepsSum = steps.reduce((sum, step) => sum + step.value, 0);

  return (
    <Flex vertical gap="small">
      <Flex justify="space-between" align="flex-end">
        <Typography.Text strong>{title}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: "0.75rem" }}>
          {stepsSum} / {max} ECTS
        </Typography.Text>
      </Flex>
      <div
        style={{
          display: "flex",
          gap: "2px",
          overflow: "hidden",
          width: "100%",
          height: "0.5rem",

          backgroundColor: trackColor,
          borderRadius: "0.25rem",
        }}
      >
        {steps.map((step) => (
          <Tooltip title={step.title} key={step.id}>
            <div
              style={{
                width: 100 / (max / step.value) + "%",
                height: "100%",
                backgroundColor: step.color,
              }}
            ></div>
          </Tooltip>
        ))}
      </div>
    </Flex>
  );
}
