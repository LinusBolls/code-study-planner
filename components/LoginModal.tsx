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

  const [authMethod, setAuthMethod] = useState<
    "google" | "bearer_token" | "credentials"
  >("google");

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
        <Flex vertical gap="middle">
          {authMethod === "google" && (
            <>
              <Typography.Text>
                Thank you for using Study Planner! Use your CODE Google Account
                to sign-in.
              </Typography.Text>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(
                    "received credentialResponse:",
                    credentialResponse
                  );
                  const googleToken = credentialResponse.credential;

                  if (!googleToken) {
                    console.error(
                      "missing credential in credentialResponse:",
                      credentialResponse
                    );
                    throw new Error(
                      "Google login failed: missing credential in credentialsResponse"
                    );
                  } else {
                    signInWithGoogleToken(googleToken);
                  }
                }}
                onError={() => {
                  throw new Error("Google login failed");
                }}
              />
              <Typography.Text type="secondary" style={{ fontSize: "0.75rem" }}>
                Don&apos;t have a CODE Google account?{" "}
                <Button
                  type="link"
                  style={{
                    fontSize: "0.75rem",
                    padding: 0,
                  }}
                  onClick={() => setAuthMethod("bearer_token")}
                >
                  Switch to bearer token login.
                </Button>
              </Typography.Text>
            </>
          )}
          {authMethod === "bearer_token" && (
            <>
              <Input
                disabled={isLoading}
                type="password"
                placeholder="Your access token for the CODE Learning Platform"
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
              <Typography.Text type="secondary" style={{ fontSize: "0.75rem" }}>
                Don&apos;t know how to get your access token?{" "}
                <Button
                  type="link"
                  style={{
                    fontSize: "0.75rem",
                    padding: 0,
                  }}
                  onClick={() => setAuthMethod("google")}
                >
                  Switch to Google login.
                </Button>
              </Typography.Text>
            </>
          )}
        </Flex>
        {authMethod === "bearer_token" && (
          <>
            {/* <Collapse title="Why do we need this?"></Collapse> */}
            <Typography.Title level={4}>Why do we need this?</Typography.Title>
            <Typography.Text>
              The Study Planner interacts with the Learning Platform API to see
              what modules are available to you and which ones you&apos;ve
              already taken. We don&apos;t store any of this data, you are the
              only one that will see it. We also don&apos;t store your access
              token.
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
                      Using Cmd + Shift + I on mac or Ctrl + Shift + I on
                      windows.
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
          </>
        )}
      </form>
    </Modal>
  );
}
