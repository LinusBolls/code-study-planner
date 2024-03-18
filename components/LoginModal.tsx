import { Button, Flex, Input, Modal, Typography } from "antd";
import { useState } from "react";

export interface LoginModalProps {
  onSubmit: (token: string) => void;
}
export default function LoginModal({ onSubmit }: LoginModalProps) {
  const [token, setToken] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit(token);
      }}
    >
      <Modal
        open
        closable={false}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Typography.Title level={4}>Welcome to Study Planner</Typography.Title>
        Please enter your access token for the CODE Learning Platform.
        <Flex vertical gap="medium">
          <Input
            type="password"
            placeholder="Access token"
            style={{ marginTop: "1rem" }}
            size="large"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Flex justify="end">
            <Button type="primary">Submit</Button>
          </Flex>
        </Flex>
      </Modal>
    </form>
  );
}
