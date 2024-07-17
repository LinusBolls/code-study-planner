"use client";

import Header from "@/components/Header";
import { Layout, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Image from "next/image";

export default function Page() {
  return (
    <Layout className="min-h-screen bg-white">
      <Header />
      <Layout.Content className="h-full max-w-prose left-10 relative ml-44 pb-20">
        <Typography.Title level={1}>Study Planner</Typography.Title>
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
          Hi, I&apos;m Linus, a #highfive Software Engineering student at CODE!
        </Typography.Paragraph>
        <Typography.Paragraph>
          My goal with this app is to provide some sense of direction to the
          very free-form learning experience at CODE, and to give students an
          overview about where they&apos;re at in their studies. I&apos;ll add
          more features in the future (star reviews for modules anyone? 👀), so
          stay tuned 🤙
        </Typography.Paragraph>
        <Typography.Paragraph>
          Study Planner is in no way officially associated with CODE, I&apos;m
          the only one working on it. This means that even though I do my best
          to give you good advice, I don&apos;t take any responsibility for
          inaccurate information. You should always reference official resources
          before making important decisions regarding your studies.
        </Typography.Paragraph>

        <Typography.Title level={2}>Technical details</Typography.Title>
        <Typography.Paragraph>
          Study Planner uses a custom library,{" "}
          <Link
            href="https://github.com/linusbolls/code-university-sdk"
            target="_blank"
          >
            CODE University SDK
          </Link>
          , to interact with the GraphQL API of the CODE Learning Platform. This
          means that it&apos;s vulnerable to breaking changes.
        </Typography.Paragraph>
        <Typography.Paragraph>
          The planner itself is also{" "}
          <Link
            href="https://github.com/linusbolls/code-study-planner"
            target="_blank"
          >
            open source
          </Link>
          .
        </Typography.Paragraph>
        <Typography.Title level={2}>How you can help</Typography.Title>
        <Typography.Paragraph>
          Right now it&apos;s just me, but you can join the team! Just contact
          me on{" "}
          <Link
            href="https://codeuniversity.slack.com/team/U02B3P8T6N7"
            target="_blank"
          >
            Slack
          </Link>
          . Or if you just want to propose a small change, feel free to open a{" "}
          <Link
            href="https://github.com/LinusBolls/code-study-planner"
            target="_blank"
          >
            pull request
          </Link>{" "}
          or an{" "}
          <Link
            href="https://github.com/LinusBolls/code-study-planner/issues/new"
            target="_blank"
          >
            issue
          </Link>{" "}
          and I&apos;ll check it out.
        </Typography.Paragraph>
      </Layout.Content>
    </Layout>
  );
}
