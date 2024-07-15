import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Flex, Tooltip, Typography } from "antd";
import StatusText from "./ECTSPanel/StatusText";

export interface ECTSProgressStep {
  id: string;
  title: string;
  value: number;
  color: string;
  isWeak?: boolean;
}

export interface ECTSProgressProps {
  title: string;
  trackColor?: string;
  max: number;
  steps: ECTSProgressStep[];
  isRequired?: boolean;
  disabled?: boolean;
}
export default function ECTSProgress({
  title,
  trackColor = "#F0F0F0",
  max,
  steps,
  isRequired = false,
  disabled = false,
}: ECTSProgressProps) {
  const stepsSum = steps.reduce((sum, step) => sum + step.value, 0);

  return (
    <Flex vertical gap="small">
      <Flex justify="space-between" align="flex-end">
        <Typography.Text strong type={disabled ? "secondary" : undefined}>
          {title}
        </Typography.Text>
        <StatusText
          disabled={disabled}
          status={
            isRequired ? (stepsSum >= max ? "success" : "error") : undefined
          }
        >
          {stepsSum} / {max} ECTS
        </StatusText>
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

          filter: disabled ? "saturate(95%) brightness(95%)" : undefined,
        }}
      >
        {steps.map((step) => {
          return (
            <Tooltip title={step.title} key={step.id}>
              <div
                style={{
                  width: 100 / (max / step.value) + "%",
                  height: "100%",
                  borderRadius: "1px",
                  background: step.isWeak
                    ? hatchedBackground(step.color)
                    : step.color,
                  backgroundRepeat: "repeat",
                }}
              ></div>
            </Tooltip>
          );
        })}
      </div>
    </Flex>
  );
}

export const getDiagonalHatchDataUrl = (
  color: string,
  hatchColor?: string
): string => {
  const svgContent = `
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="8" height="8" fill="${color}" fill-opacity="0.75"/>
      <path d="M4 0L0 8H4L8 0H4Z" fill="${
        hatchColor ?? color
      }" fill-opacity="1"/>
    </svg>
  `;
  const encodedSvg = encodeURIComponent(svgContent.replace(/\n/g, "").trim());
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
};

export const hatchedBackground = (
  color: string,
  hatchColor?: string
): string => {
  return `url("${getDiagonalHatchDataUrl(color, hatchColor)}")`;
};
