import { Segmented, Typography } from "antd";
import { GlobalOutlined, LockOutlined } from "@ant-design/icons";

import AccessManagementTable from "./AccessManagementTable";

export default function StudyPlanSettings() {
  return (
    <>
      <Segmented
        style={{
          marginTop: "0.5rem",
          marginBottom: "2rem",
        }}
        options={[
          // we'll need <LinkOutlined />
          // we'll need <ShareOutlined />
          // we'll need <UserAddOutlined />
          {
            value: "private",
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <LockOutlined
                  style={{
                    padding: "1.5rem",
                    paddingLeft: "13px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Private
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Only the people in the list will be able to see this study
                    plan.
                  </Typography.Text>
                </div>
              </div>
            ),
          },
          {
            value: "public",
            label: (
              //   <div style={{ padding: 4 }}>
              //     <GlobalOutlined />
              //     <Typography.Title level={5}>Public</Typography.Title>
              //     <Typography.Text>
              //       This study plan will be listed for everyone to see.
              //     </Typography.Text>
              //   </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <GlobalOutlined
                  style={{
                    padding: "1.5rem",
                    paddingLeft: "13px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Public
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    This study plan will be listed for everyone to see.
                  </Typography.Text>
                </div>
              </div>
            ),
          },
        ]}
        onChange={(value) => {
          console.log(value);
        }}
      />
      <AccessManagementTable />
    </>
  );
}
