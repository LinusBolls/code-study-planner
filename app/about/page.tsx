"use server";

import Header from "@/components/Header";
import { Layout } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Image from "next/image";

export default async function Page() {
  return (
    <Layout className="min-h-screen">
      <Header />
      <div
        className="flex justify-center px-4"
        style={{
          maxWidth: "62rem",
        }}
      >
        <main className="h-full w-full max-w-prose relative pb-20">
          <Title level={1}>Study Planner</Title>
          <Paragraph>
            An editor to guide you towards your degree at CODE.
          </Paragraph>
          <Image
            src="/studyPlannerScreenshot.webp"
            alt="Study Planner"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
          <Title level={2}>About</Title>
          <Image
            src="/linus.webp"
            alt="Me"
            width={16 * 12}
            height={16 * 12}
            style={{
              borderRadius: "99rem",
            }}
          />
          <Paragraph>
            Hi, I&apos;m Linus, a #highfive Software Engineering student at
            CODE!
          </Paragraph>
          <Paragraph>
            My goal with this app is to provide some sense of direction to the
            very free-form learning experience at CODE, and to give students an
            overview about where they&apos;re at in their studies. I&apos;ll add
            more features in the future (star reviews for modules anyone? 👀),
            so stay tuned 🤙
          </Paragraph>
          <Paragraph>
            Study Planner is in no way officially associated with CODE, I&apos;m
            the only one working on it. This means that even though I do my best
            to give you good advice, I don&apos;t take any responsibility for
            inaccurate information. You should always reference official
            resources before making important decisions regarding your studies.
          </Paragraph>

          <Title level={2}>Technical details</Title>
          <Paragraph>
            Study Planner uses a custom library,{" "}
            <Link
              href="https://github.com/linusbolls/code-university-sdk"
              target="_blank"
            >
              CODE University SDK
            </Link>
            , to interact with the GraphQL API of the CODE Learning Platform.
            This means that it&apos;s vulnerable to breaking changes.
          </Paragraph>
          <Paragraph>
            The planner itself is also{" "}
            <Link
              href="https://github.com/linusbolls/code-study-planner"
              target="_blank"
            >
              open source
            </Link>
            .
          </Paragraph>
          <Title level={2}>How you can help</Title>
          <Paragraph>
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
          </Paragraph>
        </main>
      </div>
    </Layout>
  );
}
