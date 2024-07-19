import { EXPERIMENTAL_STUDY_PLAN_SHARING } from "@/experimental";
import { clearCache } from "@/services/caching";
import {
  AuditOutlined,
  BugOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Row,
  Typography,
} from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";

export interface HeaderProps {
  isLoading?: boolean;
  user?: {
    username: string;
    avatarUrl: string;
  } | null;
  isMobile?: boolean;
}
export default function Header({
  isLoading = false,
  user,
  isMobile = false,
}: HeaderProps) {
  return (
    <Layout.Header
      style={{
        display: "flex",
        justifyContent: "space-between",

        height: "4rem",
        padding: "0 1.5rem",

        background: "white",
        boxShadow: "rgba(29, 35, 41, 0.05) 0px 2px 8px 0px",
        zIndex: 1,
      }}
    >
      <Row
        style={{
          justifyContent: EXPERIMENTAL_STUDY_PLAN_SHARING
            ? "space-between"
            : undefined,

          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",

            height: "100%",
          }}
        >
          {EXPERIMENTAL_STUDY_PLAN_SHARING ? (
            <Breadcrumb
              items={[
                {
                  title: <a href="/study-plans">Study Plans</a>,
                },
                {
                  title: (
                    <a href="/users/6bc2df6e-382c-4835-8ecd-dca943cd59be">
                      <img
                        alt="Linus Bolls' Avatar"
                        src={user?.avatarUrl}
                        style={{
                          width: "1rem",
                          height: "1rem",
                          borderRadius: "2px",
                          marginRight: "6px",

                          position: "relative",
                          top: "3px",
                        }}
                      />
                      <span>Linus Bolls</span>
                    </a>
                  ),
                  menu: {
                    items: [
                      {
                        key: "1",
                        label: (
                          <a href="/users/6bc2df6e-382c-4835-8ecd-dca943cd59be">
                            Oskar Küch
                          </a>
                        ),
                      },
                      {
                        key: "2",
                        label: (
                          <a href="/users/6bc2df6e-382c-4835-8ecd-dca943cd59be">
                            Silas Maughn
                          </a>
                        ),
                      },
                      {
                        key: "3",
                        label: (
                          <a href="/users/6bc2df6e-382c-4835-8ecd-dca943cd59be">
                            Laurin Notemann
                          </a>
                        ),
                      },
                    ],
                  },
                },
                {
                  title: "BSc_SE_v2",
                },
              ]}
            />
          ) : (
            <a href="/" style={{ display: "flex" }}>
              <Image
                src="/fullLogo.svg"
                width={isMobile ? 120 : 180}
                height={isMobile ? 29 : 44}
                alt="Study Planner Logo"
                style={{
                  position: "relative",
                  right: "0.9rem",
                }}
              />
            </a>
          )}
        </div>
        <Row>
          <Link
            href="/about"
            className="hover:bg-gray-100"
            style={{
              display: "flex",
              alignItems: "center",

              flex: 1,
              padding: "0 1rem",

              whiteSpace: "nowrap",

              color: "rgb(51, 51, 51)",
            }}
          >
            {isMobile ? <InfoCircleOutlined /> : "About"}
          </Link>
          <Link
            href="/privacy"
            className="hover:bg-gray-100"
            style={{
              display: "flex",
              alignItems: "center",

              flex: 1,
              padding: "0 1rem",

              whiteSpace: "nowrap",

              color: "rgb(51, 51, 51)",
            }}
          >
            {isMobile ? <AuditOutlined /> : "Privacy"}
          </Link>
          <Link
            target="_blank"
            href="https://cchckk1kg24.typeform.com/to/Xpm1iCNa"
            className="hover:bg-gray-100"
            style={{
              display: "flex",
              alignItems: "center",

              flex: 1,
              padding: "0 1rem",

              whiteSpace: "nowrap",

              color: "rgb(51, 51, 51)",
            }}
          >
            {isMobile ? <ExperimentOutlined /> : "Request a feature"}
          </Link>
          <Link
            target="_blank"
            href="https://cchckk1kg24.typeform.com/to/nUOqkEbw"
            className="hover:bg-gray-100"
            style={{
              display: "flex",
              alignItems: "center",

              flex: 1,
              padding: "0 1rem",

              whiteSpace: "nowrap",

              color: "rgb(51, 51, 51)",
            }}
          >
            {isMobile ? <BugOutlined /> : "Report a bug"}
          </Link>
        </Row>
      </Row>
      {!isLoading && user && (
        <Dropdown
          menu={{
            items: [
              // {
              //   key: "1",
              //   label: <Link href="/profile">Profile</Link>,
              //   icon: <UserOutlined />,
              // },
              // {
              //   key: "2",
              //   label: <Link href="/settings">Settings</Link>,
              //   icon: <SettingOutlined />,
              // },
              // {
              //   type: "divider",
              // },
              {
                key: "3",
                label: (
                  <Button
                    type="link"
                    onClick={() => {
                      localStorage.removeItem("learning-platform:session");
                      localStorage.removeItem("study-planner:session");

                      clearCache();

                      location.reload();
                    }}
                  >
                    Logout
                  </Button>
                ),
                icon: <PoweroffOutlined />,
              },
            ],
          }}
        >
          <Button
            type="text"
            style={{
              height: "100%",
              padding: "0 0.5rem",

              borderRadius: 0,
            }}
          >
            <Avatar
              src={user?.avatarUrl}
              style={{
                marginRight: "0.5rem",
              }}
            />
            {!isMobile && (
              <Typography.Text
                style={{
                  fontSize: "1rem",
                  lineHeight: "4rem",
                }}
              >
                {user?.username}
              </Typography.Text>
            )}
          </Button>
        </Dropdown>
      )}
    </Layout.Header>
  );
}
