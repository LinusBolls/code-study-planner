import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Typography, TypographyProps } from "antd";

export interface StatusTextProps extends Partial<TypographyProps> {
  children: React.ReactNode;
  disabled?: boolean;
  status?: "success" | "error";
  strong?: boolean;
}
export default function StatusText({
  children,
  disabled = false,
  status,
  ...rest
}: StatusTextProps) {
  const isSuccess = status === "success";
  const isError = status === "error";
  return (
    <Typography.Text
      {...rest}
      type={
        disabled
          ? undefined
          : isSuccess
          ? "success"
          : isError
          ? "warning"
          : "secondary"
      }
      style={{
        fontSize: "0.75rem",
        color: disabled ? "rgba(0, 0, 0, 0.2)" : undefined,
      }}
    >
      {disabled ? null : isSuccess ? (
        <CheckCircleOutlined />
      ) : isError ? (
        <CloseCircleOutlined />
      ) : null}{" "}
      {children}
    </Typography.Text>
  );
}
