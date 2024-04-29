import { clearCache } from "@/services/caching";
import { PoweroffOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Row, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";

export interface HeaderProps {
  isLoading?: boolean;
  user?: {
    username: string;
    avatarUrl: string;
  } | null;
}
export default function Header({ isLoading = false, user }: HeaderProps) {
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
      <Row>
        <div
          style={{
            display: "flex",
            alignItems: "center",

            height: "100%",
          }}
        >
          <Image
            src="/fullLogo.svg"
            width={180}
            height={44}
            alt="Study Planner Logo"
            style={{
              position: "relative",
              right: "0.9rem",
            }}
          />
        </div>
        <Row>
          <Link
            href="#"
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
            About
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
            Request a feature
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
            Report a bug
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
            <Typography.Text
              style={{
                fontSize: "1rem",
                lineHeight: "4rem",
              }}
            >
              {user?.username}
            </Typography.Text>
          </Button>
        </Dropdown>
      )}
    </Layout.Header>
  );
}
