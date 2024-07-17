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
import Header from "@/components/Header";
import withProviders from "@/components/withProviders";
import { useDragDropContext } from "./util/useDragDropContext";
import useHeader from "./Header/useHeader";
import { LearningPlatformClient } from "code-university";
import useScreenSize from "./util/useScreenSize";

function HomePage() {
  const { signInWithAccessToken, isAuthenticated, isLoadingSession } =
    useLearningPlatform();

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
      googleToken,
      { fetch: fetchProxy }
    );
    const learningPlatformAccessToken = client.accessToken;

    if (!learningPlatformAccessToken) {
      throw new Error("Failed to sign in: no access token");
    }
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
        <Header {...useHeader()} {...useScreenSize()} />
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
