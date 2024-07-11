"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLearningPlatform } from "@/services/learningPlatform/useLearningPlatform";
import LoginModal from "@/components/LoginModal";
import Sidebar from "@/components/Sidebar";
import { Layout } from "antd";
import SemestersList from "@/components/SemestersList";
import { useSemestersList } from "@/components/SemestersList/useSemestersList";
import Header from "@/components/Header";
import withProviders from "@/components/withProviders";
import { useDragDropContext } from "./util/useDragDropContext";
import useHeader from "./Header/useHeader";
import { LearningPlatformClient } from "code-university";

function HomePage() {
  const { signInWithAccessToken, isAuthenticated, isLoadingSession } =
    useLearningPlatform();

  console.log("[home] isAuthenticated:", isAuthenticated);
  console.log("[home] isLoadingSession:", isLoadingSession);

  const { onDragStart, onDragEnd } = useDragDropContext();

  async function signIn(learningPlatformAccessToken: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ learningPlatformAccessToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to sign in");
    }
    const data = await res.json();

    localStorage.setItem("study-planner:session", data.accessToken);

    await signInWithAccessToken(learningPlatformAccessToken);
  }
  async function signInWithGoogleToken(googleToken: string) {
    const client = await LearningPlatformClient.fromGoogleAccessToken(
      googleToken
    );
    const learningPlatformAccessToken = client.accessToken!;

    await signIn(learningPlatformAccessToken);
  }

  return (
    <>
      {!isAuthenticated && !isLoadingSession && (
        <LoginModal
          onSubmit={signIn}
          signInWithGoogleToken={signInWithGoogleToken}
        />
      )}
      <Layout className="h-screen">
        <Header {...useHeader()} />
        <Layout.Content className="h-full">
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="bg-white w-full h-full flex">
              <PanelGroup autoSaveId="semester-planner" direction="horizontal">
                <SemestersList {...useSemestersList()} />
                <PanelResizeHandle />
                <Sidebar />
              </PanelGroup>
            </div>
          </DragDropContext>
        </Layout.Content>
      </Layout>
    </>
  );
}
export default withProviders(HomePage);
