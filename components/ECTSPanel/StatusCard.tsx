import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Card, CardProps } from "antd";

export const Status = {
  success: {
    id: "success",
    type: "success" as const,
    icon: CheckCircleOutlined,
    color: "rgb(82, 196, 26)", // or #389e0d
    colorLight: "#f6ffed",
  },
  error: {
    id: "error",
    type: "warning" as const,
    icon: CloseCircleOutlined,
    color: "rgb(250, 173, 20)",
    colorLight: "rgba(250, 173, 20, 0.2)",
  },
};

export interface StatusCardProps extends CardProps {
  status?: "success" | "error";
  children: React.ReactNode;
  disabled?: boolean;
}

export default function StatusCard({
  status,
  disabled,
  children,
  ...rest
}: StatusCardProps) {
  const stat = status ? Status[status] : undefined;

  const thickBorder = stat != null && false;

  const borderColor = undefined; // stat?.color;

  return (
    <Card
      {...rest}
      style={{
        borderRadius: "0.25rem",

        background:
          disabled || stat?.id === "success"
            ? "rgba(0, 0, 0, 0.02)"
            : undefined,
        borderColor,

        borderWidth: thickBorder ? "2px" : undefined,
      }}
      styles={{
        header: {
          padding: "0 1rem",

          color: disabled ? "rgba(0, 0, 0, 0.45)" : undefined,

          borderBottomColor: borderColor,

          borderBottomWidth: thickBorder ? "2px" : undefined,
        },
        body: {
          display: "flex",
          flexDirection: "column",

          padding: "0 1rem 0 1rem",
          gap: "1rem",
        },
      }}
    >
      {children}
    </Card>
  );
}

// title={
//   <>
//     <Status.success.icon style={{ marginRight: "0.5rem" }} />
//     Orientation and Core Semesters
//   </>
// }
