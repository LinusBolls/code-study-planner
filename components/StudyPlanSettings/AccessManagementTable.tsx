import { Avatar, Button, Table, Typography } from "antd";
import type { TableProps } from "antd";
import React from "react";

interface StudyPlanMember {
  key: string;
  name: React.ReactNode;
  rank: string;
  permissions: React.ReactNode;
}

const columns: TableProps<StudyPlanMember>["columns"] = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Role",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Permissions</span>
        <Button type="primary">Add members</Button>
      </span>
    ),
    dataIndex: "permissions",
  },
];

const data: StudyPlanMember[] = [
  {
    key: "1",
    name: (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Avatar />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ lineHeight: "18px" }}>Linus Bolls</span>
          <Typography.Text type="secondary" style={{ lineHeight: "14px" }}>
            linus.bolls@code.berlin
          </Typography.Text>
        </div>
      </div>
    ),
    rank: "Student",

    permissions: (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Owner</span>
      </span>
    ),
  },
  {
    key: "2",
    name: (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Avatar />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ lineHeight: "18px" }}>Oskar Küch</span>
          <Typography.Text type="secondary" style={{ lineHeight: "14px" }}>
            oskar.kuech@code.berlin
          </Typography.Text>
        </div>
      </div>
    ),
    rank: "Student",
    permissions: (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>View</span>
        <Button danger>Remove</Button>
      </span>
    ),
  },
  {
    key: "3",
    name: (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Avatar />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ lineHeight: "18px" }}>Peter Ruppel</span>
          <Typography.Text type="secondary" style={{ lineHeight: "14px" }}>
            peter.ruppel@code.berlin
          </Typography.Text>
        </div>
      </div>
    ),
    rank: "Professor",

    permissions: (
      <span style={{ display: "flex", justifyContent: "space-between" }}>
        <span>View</span>
        <Button danger>Remove</Button>
      </span>
    ),
  },
];

const AccessManagementTable: React.FC = () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={{ style: { display: "none" } }}
  />
);

export default AccessManagementTable;
