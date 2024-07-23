"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  fetchProxy,
  useLearningPlatform,
} from "@/services/learningPlatform/useLearningPlatform";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import { Layout } from "antd";
import SemestersList from "@/components/SemestersList";
import { useSemestersList } from "@/components/SemestersList/useSemestersList";
import { StatefulHeader } from "@/components/Header";
import { useDragDropContext } from "./util/useDragDropContext";
import { LearningPlatformClient } from "code-university";
import { loginscreenMockSemesters } from "./util/mock";

export default function HomePage() {
  const { signInWithToken, isAuthenticated, isLoadingSession, isSignedOut } =
    useLearningPlatform();

  const { onDragStart, onDragEnd } = useDragDropContext();

  /**
   * accepts both refresh token and access token
   */
  async function signInWithLpToken(learningPlatformToken: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ learningPlatformToken }),
    });

    if (!res.ok) {
      throw new Error("Invalid server response");
    }
    const data = await res.json();

    localStorage.setItem("study-planner:session", data.accessToken);

    await signInWithToken(learningPlatformToken);
  }
  async function signInWithGoogleToken(googleToken: string) {
    const client = await LearningPlatformClient.fromGoogleAccessToken(
      googleToken,
      { fetch: fetchProxy }
    );
    const lpAccessToken = client.accessToken;

    if (!lpAccessToken) {
      throw new Error("No access token");
    }
    await signInWithLpToken(lpAccessToken);
  }
  const showLoginScreen =
    (!isAuthenticated && !isLoadingSession) || isSignedOut;

  return (
    <>
      <Layout className="h-screen">
        <StatefulHeader />
        <Layout.Content className="h-full">
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="bg-white w-full h-full flex">
              <PanelGroup autoSaveId="semester-planner" direction="horizontal">
                {showLoginScreen ? (
                  <>
                    <LoginModal
                      signInWithLpToken={signInWithLpToken}
                      signInWithGoogleToken={signInWithGoogleToken}
                    />
                    <UnauthedPage />
                  </>
                ) : (
                  <AuthedPage />
                )}
              </PanelGroup>
            </div>
          </DragDropContext>
        </Layout.Content>
      </Layout>
    </>
  );
}

function AuthedPage() {
  return (
    <>
      <SemestersList {...useSemestersList()} />
      <PanelResizeHandle />
      <Sidebar />
    </>
  );
}
function UnauthedPage() {
  return <SemestersList semesters={loginscreenMockSemesters} />;
}
