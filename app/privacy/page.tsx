"use server";

import Header from "@/components/Header";
import { Layout } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

export default async function Page() {
  return (
    <Layout className="min-h-screen">
      <Header />
      <main className="h-full max-w-prose left-10 relative ml-44 pb-20">
        <Title level={1}>Privacy policy</Title>
        <Paragraph>Last updated July 18th 2024</Paragraph>
        <br />
        <Paragraph>
          The Study Planner team is passionate about consumer protection. Please
          don&apos;t hesitate to reach out to us regarding your rights as a
          user. We also encourage you to take a look at the{" "}
          <Link
            href="https://github.com/LinusBolls/code-study-planner"
            target="_blank"
          >
            source code
          </Link>{" "}
          in order to verify the technical claims listed here.
        </Paragraph>

        <Title level={2} id="data-controller">
          Data controller
        </Title>
        <Paragraph
          style={{
            whiteSpace: "pre",
          }}
        >
          {`Linus Bolls (linus.bolls@code.berlin)\nCODE University of Applied Sciences\nKarl-Marx-Straße 101\n12043 Berlin\nGermany`}
        </Paragraph>
        <Title id="data-processing" level={2}>
          Data collection and processing
        </Title>
        <Title level={3} id="data-processing-vercel">
          Vercel{" "}
          {/* <Link href="#" target="_blank">
            <ExportOutlined />
          </Link> */}
        </Title>
        <Paragraph>
          A cloud provider we use for web hosting. The server our website,
          including backend, runs on is located in Frankfurt, Germany.{" "}
          <Link href="https://vercel.com/legal/privacy-policy" target="_blank">
            Relevant privacy policy
          </Link>
        </Paragraph>
        <Title level={3} id="data-processing-scaleway">
          Scaleway
        </Title>
        <Paragraph>
          A cloud provider we use for hosting our SQL database. The server our
          database runs on is located in Amsterdam, Netherlands.{" "}
          <Link
            href="https://www.scaleway.com/en/privacy-policy/"
            target="_blank"
          >
            Relevant privacy policy
          </Link>
        </Paragraph>
        <Title level={3} id="data-processing-sentry">
          Sentry
        </Title>
        <Paragraph>
          Used for automated error reports. The servers our Sentry project runs
          on are located in the European Union. Sentry receives logs about you
          including date and time of access, your ip address, and information
          about your hardware, operating system, and browser. This helps us
          provide a better service by discovering issues.{" "}
          <Link href="https://sentry.io/privacy/" target="_blank">
            Relevant privacy policy
          </Link>
        </Paragraph>
        <Title level={3} id="data-processing-learning-platform">
          CODE Learning platform
        </Title>
        <Paragraph>
          When you sign into Study Planner using Google SSO or a bearer token,
          we use the same authentication mechanism as the Learning Platform.
          <br />
          This means that we &quot;create a session for you&quot; with the LP
          servers. Using a token created by the LP servers, we communicate with
          them both from your browser and from our own servers. This token gives
          us unrestricted access to your LP account and doesn&apos;t get stored
          on our servers.
        </Paragraph>
        <Paragraph>
          We never modify any of your data stored by the Learning Platform, we
          just access it. This may change in the future as we expand the scope
          of Study Planner to allow users to e.g. sign up for modules and
          assessments.
        </Paragraph>
        <Paragraph>
          Requests we make from your browser to the LP servers get proxied over
          our own servers. This means that we have temporary access to all data
          the Study Planner requests from the LP as the data passes through our
          servers. Most of this data doesn&apos;t get permanently stored.
        </Paragraph>
        <Paragraph>
          Data we request from the LP in your name and have <b>temporary</b>{" "}
          access to includes:
          <ul>
            <li>Your LP authentication token</li>
            <li>Your LP profile, including your full name and email</li>
            <li>
              All modules you have taken in the past or are currently taking,
              including assessment results
            </li>
          </ul>
        </Paragraph>
        <Paragraph>
          Data we <b>permanently</b> store in our database includes:
          <ul>
            <li>
              Your user id for the Learning Platform. This can be linked back to
              your LP profile.
            </li>
            <li>What module handbook you&apos;re on (e.g. BSc_SE_v2)</li>
            <li>The modules you plan to take in the future</li>
          </ul>
          Both of these lists are subject to change as we add new features to
          the Study Planner.
        </Paragraph>
        <Paragraph>
          You can find the privacy policy of the learning platform attached to
          the email with your study contract you got from CODE back when you
          enrolled. Search your emails for &quot;CODE Study Contract&quot;.
        </Paragraph>
        {/* <Title level={3} id="cookies-and-tracking">
          Cookies and tracking
        </Title>
        <table style={{ borderCollapse: "collapse" }}>
          <tr>
            <th style={{ padding: "1rem" }}>Cookie</th>
            <th style={{ padding: "1rem" }}>Purpose</th>
            <th style={{ padding: "1rem" }}>Duration</th>
            <th style={{ padding: "1rem" }}>Type</th>
          </tr>
          <tr style={{ borderTop: "1px solid #F0F0F0" }}>
            <td style={{ padding: "1rem" }}>study-planner:session</td>
            <td style={{ padding: "1rem" }}>Persisting the user session</td>
            <td style={{ padding: "1rem" }}>Unlimited</td>
            <td style={{ padding: "1rem", whiteSpace: "pre" }}>
              Local storage
            </td>
          </tr>
          <tr style={{ borderTop: "1px solid #F0F0F0" }}>
            <td style={{ padding: "1rem", whiteSpace: "pre" }}>
              learning-platform:session
            </td>
            <td style={{ padding: "1rem", whiteSpace: "pre" }}>
              Authentication with the LP
            </td>
            <td style={{ padding: "1rem" }}>Unlimited</td>
            <td style={{ padding: "1rem" }}>Local storage</td>
          </tr>
        </table>
        We also store Learning Platform data locally to speed up the page
        loading. This data can be found in the local storage, with the keys
        being prefixed with `cache:`. */}
        <Title level={2} id="data-subject-rights">
          Your data subject rights
        </Title>
        <Paragraph>
          As defined in{" "}
          <Link href="https://gdpr-info.eu/art-15-gdpr/" target="_blank">
            articles 15 - 21 of the GDPR
          </Link>
          , you have the following rights:
        </Paragraph>
        <Paragraph>
          <ul>
            <li>
              <b>Right of Access (Article 15)</b> You have the right to obtain
              confirmation as to whether or not we process personal data
              concerning you, and, if so, the purpose of such processing.
            </li>
            <li>
              <b>Right to Rectification (Article 16)</b> If we process incorrect
              data about you, you have the right to have it rectified without
              undue delay.
            </li>
            <li>
              <b>Right to Erasure (Article 17)</b> You can request at any time
              that we erase all personal data we hold about you, provided there
              are no legal obligations preventing such deletion.
            </li>
            <li>
              <b>Right to Restriction of Processing (Article 18)</b> If you
              believe that we are processing your data incorrectly, you can
              request the restriction of processing until the matter is fully
              resolved.
            </li>
            <li>
              <b>Notification Obligation (Article 19)</b> If we rectify or erase
              your data, or restrict its processing, you have the right to be
              informed about it.
            </li>
            <li>
              <b>Right to Data Portability (Article 20)</b> You have the right
              to have the data we have collected about you transferred to
              another controller, should you so desire.
            </li>
            <li>
              <b>Right to Object (Article 21)</b> Any consent you have given
              (e.g., for a newsletter) can be withdrawn at any time without
              providing a reason.
            </li>
          </ul>
        </Paragraph>
      </main>
    </Layout>
  );
}
