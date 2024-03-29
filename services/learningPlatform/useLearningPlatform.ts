import {
  LearningPlatformClient,
  LearningPlatformClientOptions,
  LearningPlatformClientType,
} from "../../../code-university-sdk";
import { useEffect } from "react";
import { create } from "zustand";

interface LearningPlatformStore {
  client: LearningPlatformClientType | null;
  hasAttemptedSessionLoad: boolean;
  isLoadingSession: boolean;
  actions: {
    startLoadingSession: () => void;
    finishLoadingSession: (client: LearningPlatformClientType) => void;
    signOut: () => void;
    abortLoadingSession: () => void;
  };
}

const useLearningPlatformStore = create<LearningPlatformStore>((set) => ({
  client: null,
  isLoadingSession: true,
  hasAttemptedSessionLoad: false,
  actions: {
    startLoadingSession: () =>
      set({
        client: null,
        isLoadingSession: true,
        hasAttemptedSessionLoad: true,
      }),
    finishLoadingSession: (client: LearningPlatformClientType) =>
      set({ client, isLoadingSession: false }),
    signOut: () => set({ client: null, isLoadingSession: false }),
    abortLoadingSession: () =>
      set({
        client: null,
        isLoadingSession: false,
      }),
  },
}));

export interface AsyncStorage {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
}

export interface UseLearningPlatformOptions {
  /** defaults to learningPlatform:session */
  storageKey?: string;
  /** defaults to 'expo-secure-store' */
  asyncStorage?: AsyncStorage;
  /** the option to get passed into 'code-university's `LearningPlatformClient` */
  clientOptions?: LearningPlatformClientOptions;
}

/**
 * automatically persists the session.
 */
export const useLearningPlatform = () => {
  const asyncStorage = {
    getItemAsync: (key: string) => localStorage.getItem(key),
    setItemAsync: (key: string, value: string) =>
      localStorage.setItem(key, value),
    deleteItemAsync: (key: string) => localStorage.removeItem(key),
  };
  const storageKey = "learningPlatform:session";

  const store = useLearningPlatformStore();

  const isAuthenticated = store.client != null;
  const isUnderMaintanance = false;
  const noNetwork = false;
  const isDown = noNetwork || isUnderMaintanance;
  const isLoadingSession = store.isLoadingSession;

  async function signInWithAccessToken(accessToken: string) {
    store.actions.startLoadingSession();

    const client = await LearningPlatformClient.fromAccessToken(accessToken, {
      fetch: async (url, init) => {
        const res = await fetch("/api/learning-platform-proxy", {
          method: "POST",
          body: JSON.stringify({ url, init }),
        });
        return res;
      },
    });
    store.actions.finishLoadingSession(client);

    const storageValue = JSON.stringify({
      accessToken,
    });
    await asyncStorage.setItemAsync(storageKey, storageValue);
  }

  async function loadSessionFromStorage() {
    try {
      const storageValue = await asyncStorage.getItemAsync(storageKey);
      if (storageValue) {
        const session = JSON.parse(storageValue);

        await signInWithAccessToken(session.accessToken);
      } else {
        store.actions.abortLoadingSession();
      }
    } catch (err) {
      console.error(
        "Failed to initialize learning platform session from storage:",
        err
      );
      signOut();
    }
  }

  useEffect(() => {
    if (!store.hasAttemptedSessionLoad) {
      loadSessionFromStorage();
    }
  }, []);

  async function signOut() {
    await asyncStorage.deleteItemAsync(storageKey);

    store.actions.signOut();
  }

  return {
    isLoadingSession,
    /** whether we are authenticated and can make queries */
    enabled: !isDown && isAuthenticated,
    isDown,
    isUnderMaintanance,
    isAuthenticated,
    accessToken: store.client?.accessToken!,
    learningPlatform: store.client!,

    signInWithAccessToken,
    signOut,
  };
};
