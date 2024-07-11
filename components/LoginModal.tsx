import { Button, Flex, Image, Input, Modal, Steps, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useMessages } from "./util/useMessages";
import { GoogleLogin } from "@react-oauth/google";

export interface LoginModalProps {
  onSubmit: (token: string) => Promise<void>;
  signInWithGoogleToken: (token: string) => Promise<void>;
}
export default function LoginModal({
  onSubmit,
  signInWithGoogleToken,
}: LoginModalProps) {
  const [token, setToken] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { showErrorMessage } = useMessages();

  const showGoogleAuthOption =
    typeof window !== "undefined" &&
    localStorage.getItem("experimental:google-auth");

  return (
    <Modal
      open
      closable={false}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width="42rem"
    >
      <form
        onSubmit={async (e) => {
          try {
            e.preventDefault();

            setIsLoading(true);

            await onSubmit(token.replace(/\s/g, ""));

            setIsLoading(false);
          } catch (err) {
            showErrorMessage(
              "Login failed: " + (err as Error).message ?? "Unknown Error"
            );
            setIsLoading(false);
          }
        }}
      >
        <Typography.Title level={2}>Welcome to Study Planner</Typography.Title>
        Thank you for using Study Planner! We just need one thing from you:
        <Flex vertical gap="medium">
          {showGoogleAuthOption && (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const googleToken = credentialResponse.credential;

                if (!googleToken) {
                  console.error(
                    "missing credential in credentialResponse:",
                    credentialResponse
                  );
                } else {
                  signInWithGoogleToken(googleToken);
                }
              }}
              onError={() => {
                console.log("google login Failed");
              }}
            />
          )}
          <Input
            disabled={isLoading}
            type="password"
            placeholder="Your access token for the CODE Learning Platform"
            style={{ marginTop: "1rem" }}
            size="large"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Flex
            justify="end"
            style={{
              marginTop: "0.5rem",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
        {/* <Collapse title="Why do we need this?"></Collapse> */}
        <Typography.Title level={4}>Why do we need this?</Typography.Title>
        <Typography.Text>
          The Study Planner interacts with the Learning Platform API to see what
          modules are available to you and which ones you&apos;ve already taken.
          We don&apos;t store any of this data, you are the only one that will
          see it. We also don&apos;t store your access token.
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
                  <Link href="https://app.code.berlin" target="_blank">
                    https://app.code.berlin
                  </Link>
                </Typography.Text>
              ),
            },
            {
              title: (
                <Typography.Text>Open the browser devtools</Typography.Text>
              ),
              description: (
                <>
                  Using Cmd + Shift + I on mac or Ctrl + Shift + I on windows.
                </>
              ),
            },
            {
              title: <Typography.Text>View your cookies</Typography.Text>,
              description: (
                <>
                  By going to the <i>Application tab</i>, expanding the{" "}
                  <i>Cookies</i> item on the left, and selecting{" "}
                  <i>https://app.code.berlin</i>. If the <i>cid</i> cookie
                  doesn&apos;t show up, try refreshing the browser tab.
                </>
              ),
            },
            {
              title: (
                <Typography.Text>
                  Copy the value of the <i>cid</i> cookie
                </Typography.Text>
              ),
              description: (
                <>
                  By double-clicking the field, and copying it to your
                  clipboard.
                </>
              ),
            },
          ]}
        />
      </form>
    </Modal>
  );
}
