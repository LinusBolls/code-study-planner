import { create } from "zustand";
import { Module } from "./app/useSemesters";

const DROP_TARGET_GRACE_PERIOD_MS = 500;

interface ChatSelectionStore {
  hoveredInboxId: string | null;
  sourceInboxId: string | null;
  draggedModules: Module[];
  mouseUpInboxId: string | null;
  mouseUpInboxIdChangedUnix: number | null;
  actions: {
    startDraggingChats: (
      draggedModules: Module[],
      sourceInboxId?: string | null | undefined
    ) => void;
    stopDraggingChats: () => void;
    setMouseUpInboxId: (inboxId: string | null) => void;
    setHoveredInboxId: (inboxId: string | null) => void;
  };
}

const useChatSelectionStore = create<ChatSelectionStore>((set) => ({
  hoveredInboxId: null,
  sourceInboxId: null,
  draggedModules: [],
  mouseUpInboxId: null,
  mouseUpInboxIdChangedUnix: null,
  actions: {
    startDraggingChats: (draggedModules, sourceInboxId) =>
      set({
        draggedModules,
        sourceInboxId,
      }),

    stopDraggingChats: () => set({ draggedModules: [], sourceInboxId: null }),
    setMouseUpInboxId: (mouseUpInboxId) => {
      return set(() => ({
        mouseUpInboxId,
        mouseUpInboxIdChangedUnix: Date.now(),
      }));
    },
    setHoveredInboxId: (hoveredInboxId) => set({ hoveredInboxId }),
  },
}));

/**
 * currently only used for keeping the state related to drag-and-drop of chats between inboxes.
 * we might also move the bulk-selection related state here in the future.
 *
 * ### detecting drop targets
 *
 * we use `@flamingo/dnd` for drag and drop, which is our own fork of `react-beautiful-dnd`.
 *
 * `react-beautiful-dnd` detects the drop target based on the dimensions of the dragged item, as opposed to the cursor position,
 * there is no built-in way to change this.
 * but we want the drop target to be the one the user's cursor is over, so we need to homebrew our own system.
 *
 * the way we do this is to attach an `onMouseUp` listener to all drop targets, which calls `useChatSelection().actions.setMouseUpInboxId(inboxId)`.
 * then, when the drag action is completed, we use the drop target which last fired this event as the drop target.
 */
export const useChatSelection = () => {
  const store = useChatSelectionStore();

  const mouseUpInboxChangedRecently =
    Date.now() - (store.mouseUpInboxIdChangedUnix ?? 0) <
    DROP_TARGET_GRACE_PERIOD_MS;

  const dropTargetInboxId = mouseUpInboxChangedRecently
    ? store.mouseUpInboxId
    : null;

  const isDraggingChats = store.draggedModules.length > 0;

  return {
    draggedModules: store.draggedModules,
    sourceInboxId: store.sourceInboxId,
    hoveredInboxId: store.hoveredInboxId,

    startDraggingChats: store.actions.startDraggingChats,
    stopDraggingChats: store.actions.stopDraggingChats,

    setHoveredInboxId: store.actions.setHoveredInboxId,
    setMouseUpInboxId: store.actions.setMouseUpInboxId,
    /**
     * whether the user is currently dragging one or multiple chats
     */
    isDraggingChats,
    /**
     * which inbox to move dropped chats to while dragging one or multiple chats
     */
    dropTargetInboxId,
  };
};

export const useIsDraggingChats = () => {
  const draggedModules = useChatSelectionStore((store) => store.draggedModules);

  return draggedModules.length > 0;
};

export const getChatSelectionState = () => {
  const store = useChatSelectionStore.getState();

  const mouseUpInboxChangedRecently =
    Date.now() - (store.mouseUpInboxIdChangedUnix ?? 0) <
    DROP_TARGET_GRACE_PERIOD_MS;

  const dropTargetInboxId = mouseUpInboxChangedRecently
    ? store.mouseUpInboxId
    : null;

  const isDraggingChats = store.draggedModules.length > 0;

  return {
    draggedModules: store.draggedModules,
    sourceInboxId: store.sourceInboxId,
    hoveredInboxId: store.hoveredInboxId,

    startDraggingChats: store.actions.startDraggingChats,
    stopDraggingChats: store.actions.stopDraggingChats,

    setHoveredInboxId: store.actions.setHoveredInboxId,
    setMouseUpInboxId: store.actions.setMouseUpInboxId,
    /**
     * whether the user is currently dragging one or multiple chats
     */
    isDraggingChats,
    /**
     * which inbox to move dropped chats to while dragging one or multiple chats
     */
    dropTargetInboxId,
  };
};
