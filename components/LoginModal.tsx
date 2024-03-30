import {
  Button,
  Collapse,
  Flex,
  Image,
  Input,
  Modal,
  Steps,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";

export interface LoginModalProps {
  onSubmit: (token: string) => void;
}
export default function LoginModal({ onSubmit }: LoginModalProps) {
  const [token, setToken] = useState("");

  return (
    <Modal
      open
      closable={false}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width="42rem"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          onSubmit(token);
        }}
      >
        <Typography.Title level={2}>Welcome to Study Planner</Typography.Title>
        Thank you for using Study Planner! We just need one thing from you:
        <Flex vertical gap="medium">
          <Input
            type="password"
            placeholder="Your access token for the CODE Learning Platform"
            style={{ marginTop: "1rem" }}
            size="large"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Flex justify="end">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Flex>
        </Flex>
        {/* <Collapse title="Why do we need this?"></Collapse> */}
        <Typography.Title level={4}>Why do we need this?</Typography.Title>
        <Typography.Text>
          We interact with the Learning Platform API to see what modules are
          available to you and which ones you&apos;ve already taken. We
          don&apos;t store any of this data; You are the only one that will see
          it.
        </Typography.Text>
        <Typography.Title level={4}>How do I get this?</Typography.Title>
        <Image
          src="https://github.com/LinusBolls/code-university-sdk/raw/main/docs/getting-your-access-token.webp"
          alt="Screenshot of the cookies tab"
        />
        <Steps
          current={-1}
          direction="vertical"
          items={[
            {
              title: (
                <Typography.Text>
                  Open{" "}
                  <Link href="https://app.code.berlin">
                    https://app.code.berlin
                  </Link>
                </Typography.Text>
              ),
            },
            {
              title: `Open the browser devtools`,
              description:
                "Using Cmd + Shift + I on mac or Ctrl + Shift + I on windows",
            },
            {
              title: "Click on the Application tab",
            },
            {
              title: `Double-click the Value field of the cid cookie, and copy it to your clipboard.`,
            },
          ]}
        />
        {/* <ol>
          <li>
            <Typography.Text>Open https://app.code.berlin</Typography.Text>
          </li>
          <li>
            <Typography.Text>
              Open the browser devtools using Cmd + Shift + I on mac or Ctrl +
              Shift + I on windows
            </Typography.Text>
          </li>
          <li>
            <Typography.Text>Click on the Application tab</Typography.Text>
          </li>
          <li>
            <Typography.Text>
              On the left side of the Application tab, click Cookies {">"}{" "}
              https://app.code.berlin
            </Typography.Text>
          </li>
          <li>
            <Typography.Text>
              Double-click the Value field of the cid cookie, and copy it to
              your clipboard.
            </Typography.Text>
          </li>
        </ol> */}
      </form>
    </Modal>
  );
}
