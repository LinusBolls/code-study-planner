import { LoadingOutlined } from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import {
  Button,
  Flex,
  Image,
  Input,
  Modal,
  Row,
  Steps,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";

import { useMessages } from "./util/useMessages";

const removeAllWhitespace = (str: string) => str.replace(/\s/g, "");

export interface LoginModalProps {
  signInWithLpToken: (token: string) => Promise<void>;
  signInWithGoogleToken: (token: string) => Promise<void>;
}
export default function LoginModal({
  signInWithLpToken,
  signInWithGoogleToken,
}: LoginModalProps) {
  const { showErrorMessage } = useMessages();

  const [authMethod, setAuthMethod] = useState<
    "google" | "bearer_token" | "credentials"
  >("google");

  const [token, setToken] = useState("");

  const [isGoogleAuthInProgress, setIsGoogleAuthInProgress] = useState(false);

  const [isTokenAuthInProgress, setIsTokenAuthInProgress] = useState(false);

  return (
    <Modal
      open
      closable={false}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width="42rem"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={async (e) => {
          try {
            e.preventDefault();

            setIsTokenAuthInProgress(true);

            await signInWithLpToken(removeAllWhitespace(token));
          } catch (err) {
            showErrorMessage(
              "Login failed: " + (err as Error).message ?? "Unknown Error",
            );
          } finally {
            setIsTokenAuthInProgress(false);
          }
        }}
      >
        <Flex
          vertical
          gap="middle"
          align="center"
          style={{
            maxWidth: "34rem",

            padding: "0.5rem 1.5rem",
          }}
        >
          <Typography.Title
            level={2}
            style={{
              textAlign: "center",
              margin: 0,
            }}
          >
            Welcome to Study Planner
          </Typography.Title>

          {authMethod === "google" && (
            <>
              <Typography.Text
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {isGoogleAuthInProgress ? (
                  <LoadingOutlined
                    spin
                    size={48}
                    style={{
                      color: "rgb(22, 119, 255)",
                    }}
                  />
                ) : (
                  <>Use your CODE Google Account to sign in.</>
                )}
              </Typography.Text>
              <GoogleLogin
                click_listener={() => setIsGoogleAuthInProgress(true)}
                containerProps={{
                  style: {
                    display: "flex",
                    justifyContent: "center",

                    width: "100%",
                  },
                }}
                onSuccess={async (credentialResponse) => {
                  try {
                    const googleToken = credentialResponse.credential;

                    if (!googleToken) {
                      console.error(
                        "missing credential in credentialResponse:",
                        credentialResponse,
                      );
                      throw new Error(
                        "Missing credential in credentialsResponse",
                      );
                    }
                    await signInWithGoogleToken(googleToken);
                  } catch (err) {
                    showErrorMessage(
                      "Google login failed: " + (err as Error).message ??
                        "Unknown Error",
                    );
                  } finally {
                    setIsGoogleAuthInProgress(false);
                  }
                }}
                onError={() => {
                  setIsGoogleAuthInProgress(false);

                  showErrorMessage("Google login failed");
                }}
              />
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: "0.75rem",
                }}
              >
                By signing in, you grant Study Planner unrestricted access to
                your{" "}
                <Link href="https://app.code.berlin" target="_blank">
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: "0.75rem",
                      textDecoration: "underline",
                    }}
                  >
                    Learning Platform
                  </Typography.Text>
                </Link>{" "}
                account.
              </Typography.Text>
              <Flex
                justify="space-between"
                style={{
                  width: "100%",
                }}
              >
                <Button
                  type="link"
                  style={{
                    display: "flex",
                    height: "1rem",
                    padding: 0,
                  }}
                  onClick={() => setAuthMethod("bearer_token")}
                >
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: "0.75rem",
                      textDecoration: "underline",
                    }}
                  >
                    Login with token
                  </Typography.Text>
                </Button>
                <Flex gap="middle">
                  <Link
                    href="/about"
                    style={{
                      display: "flex",
                      height: "1rem",
                      padding: 0,
                    }}
                  >
                    <Typography.Text
                      type="secondary"
                      style={{
                        fontSize: "0.75rem",
                        textDecoration: "underline",
                      }}
                    >
                      About
                    </Typography.Text>
                  </Link>
                  <Link
                    href="/privacy"
                    style={{
                      display: "flex",
                      height: "1rem",
                      padding: 0,
                    }}
                  >
                    <Typography.Text
                      type="secondary"
                      style={{
                        fontSize: "0.75rem",
                        textDecoration: "underline",
                      }}
                    >
                      Privacy
                    </Typography.Text>
                  </Link>
                </Flex>
              </Flex>
            </>
          )}
          {authMethod === "bearer_token" && (
            <>
              <Input
                disabled={isTokenAuthInProgress}
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
                  loading={isTokenAuthInProgress}
                  disabled={isTokenAuthInProgress}
                >
                  Submit
                </Button>
              </Flex>
              <Typography.Text type="secondary" style={{ fontSize: "0.75rem" }}>
                Don&apos;t know how to get your access token?{" "}
                <Button
                  type="link"
                  style={{
                    padding: 0,
                  }}
                  onClick={() => setAuthMethod("google")}
                >
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: "0.75rem",
                      textDecoration: "underline",
                    }}
                  >
                    Switch to Google login.
                  </Typography.Text>
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
