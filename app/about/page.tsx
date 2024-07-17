"use client";

import Header from "@/components/Header";
import { Layout, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";

export default function Page() {
  return (
    <Layout className="min-h-screen bg-white">
      <Header />
      <Layout.Content className="h-full max-w-prose left-10 relative">
        <Typography.Title level={1}>Study Planner for CODE</Typography.Title>
        <Typography.Paragraph>
          An editor to guide you towards your degree at CODE.
        </Typography.Paragraph>
        <Image
          src="/studyPlannerScreenshot.webp"
          alt="Study Planner"
          width={512}
          height={256}
        />
        <Typography.Title level={2}>About</Typography.Title>
        <Image
          src="/linus.webp"
          alt="Me"
          width={16 * 12}
          height={16 * 12}
          style={{
            borderRadius: "99rem",
          }}
        />
        <Typography.Paragraph>
          Hi, I&apos;m Linus, a #highfive Software Engineering student at CODE,
          and the creator of Study Planner. Study Planner is{" "}
          <b>in no way officially associated with CODE</b>, I&apos;m the only
          one working on it. This means that even though I do my best to give
          you good advice, I don&apos;t take any responsibility for any
          inaccurate information. You should always reference official resources
          before making important decisions regarding your studies. But you can
          join the team! The goal of Study Planner is to provide some sense of
          direction to the very free-form learning experience at CODE.
        </Typography.Paragraph>

        <Typography.Title level={2}>
          Technical stuff and data protection
        </Typography.Title>
        <Typography.Paragraph>
          Study Planner uses a package built by me,{" "}
          <Link
            href="https://github.com/linusbolls/code-university-sdk"
            target="_blank"
          >
            CODE University SDK
          </Link>
          , to interact with the GraphQL API of the CODE Learning Platform. This
          means that it&apos;s vulnerable to breaking changes.
        </Typography.Paragraph>
        <Typography.Title level={2}>Contributing</Typography.Title>
        <Typography.Paragraph>
          Right now it&apos;s just me, but you could join the team! Just contact
          me on{" "}
          <Link
            href="https://codeuniversity.slack.com/team/U02B3P8T6N7"
            target="_blank"
          >
            Slack
          </Link>
          . If you don&apos;t want to commit this hard, just open a{" "}
          <Link
            href="https://github.com/LinusBolls/code-study-planner"
            target="_blank"
          >
            pull request
          </Link>{" "}
          and I&apos;ll check it out.
        </Typography.Paragraph>
      </Layout.Content>
    </Layout>
  );
}
