import {
  PoweroffOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Typography } from "antd";
import Link from "antd/es/typography/Link";

export interface HeaderProps {
  isLoading?: boolean;
  username?: string | null;
  avatarUrl?: string | null;
}
export default function Header({
  isLoading = false,
  username,
  avatarUrl,
}: HeaderProps) {
  return (
    <Layout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",

        height: "4rem",
        padding: "0 1.5rem",

        background: "white",
        boxShadow: "rgba(29, 35, 41, 0.05) 0px 2px 8px 0px",
        zIndex: 1,
      }}
    >
      {!isLoading && (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: <Link href="/profile">Profile</Link>,
                icon: <UserOutlined />,
              },
              {
                key: "2",
                label: <Link href="/settings">Settings</Link>,
                icon: <SettingOutlined />,
              },
              {
                type: "divider",
              },
              {
                key: "3",
                label: (
                  <Button
                    type="link"
                    onClick={() => {
                      localStorage.removeItem("learning-platform:session");
                      localStorage.removeItem("study-planner:session");

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
              src={avatarUrl}
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
              {username}
            </Typography.Text>
          </Button>
        </Dropdown>
      )}
    </Layout.Header>
  );
}
