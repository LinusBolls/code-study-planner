import {
  LearningPlatformClient,
  LearningPlatformClientOptions,
  LearningPlatformClientType,
} from "code-university";
import { useEffect, useState } from "react";
import { create } from "zustand";

export const fetchProxy: typeof fetch = async (url, init) => {
  const res = await fetch("/api/learning-platform-proxy", {
    method: "POST",
    body: JSON.stringify({ url, init }),
  });
  return res;
};

let isActuallyLoadingTheSession = false;

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
  /** defaults to learning-platform:session */
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
  const storageKey = "learning-platform:session";

  const store = useLearningPlatformStore();

  const isAuthenticated = store.client != null;
  const isUnderMaintanance = false;
  const noNetwork = false;
  const isDown = noNetwork || isUnderMaintanance;
  const isLoadingSession = store.isLoadingSession;

  const isSignedOut =
    typeof window === "undefined"
      ? true
      : localStorage.getItem(storageKey) == null;

  async function signInWithToken(accessToken: string) {
    store.actions.startLoadingSession();

    const client = await LearningPlatformClient.fromAnyToken(accessToken, {
      fetch: fetchProxy,
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

        // in case the stored token is expired, but the `cid` cookie is set, this will still work.
        await signInWithToken(session.accessToken);
      } else {
        store.actions.abortLoadingSession();
      }
    } catch (err) {
      console.error(
        "Failed to initialize learning platform session from storage:",
        err,
      );
      signOut();
    }
  }

  // dirty hack because we want to rerender when setting `isActuallyLoadingTheSession = false`
  const [_, setShouldRerender] = useState(false);

  useEffect(() => {
    if (!store.hasAttemptedSessionLoad && !isActuallyLoadingTheSession) {
      store.actions.startLoadingSession();
      // TODO: why is this triggering more than once
      isActuallyLoadingTheSession = true;

      loadSessionFromStorage().then(() => {
        isActuallyLoadingTheSession = false;

        setShouldRerender((prev) => !prev);
      });
    }
  }, [isActuallyLoadingTheSession]);

  async function signOut() {
    await asyncStorage.deleteItemAsync(storageKey);

    store.actions.signOut();
  }

  return {
    isLoadingSession: isActuallyLoadingTheSession,
    /** whether we are authenticated and can make queries */
    enabled: !isDown && isAuthenticated,
    isDown,
    isUnderMaintanance,
    isAuthenticated,
    accessToken: store.client?.accessToken!,
    learningPlatform: store.client!,
    isSignedOut,

    signInWithToken,
    signOut,
  };
};
