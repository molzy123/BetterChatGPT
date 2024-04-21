import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { PromptSlice, createPromptSlice } from './prompt-slice';
import { ToastSlice, createToastSlice } from './toast-slice';
import { createUserSlice, UserSlice } from '@store/user-slice';

// 声明存储状态的类型
export type StoreState = ChatSlice &
  InputSlice &
  AuthSlice &
  ConfigSlice &
  PromptSlice &
  ToastSlice &
  UserSlice;

// 定义存储片段类型
export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

// 创建部分化的状态函数
export const createPartializedState = (state: StoreState) => ({
  // 选择要使用的状态字段
  apiKey: state.apiKey,
  userToken: state.userToken,
  apiEndpoint: state.apiEndpoint,
  theme: state.theme,
  autoTitle: state.autoTitle,
  advancedMode: state.advancedMode,
  prompts: state.prompts,
  defaultChatConfig: state.defaultChatConfig,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  firstVisit: state.firstVisit,
  hideSideMenu: state.hideSideMenu,
  folders: state.folders,
  enterToSubmit: state.enterToSubmit,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
  totalTokenUsed: state.totalTokenUsed,
  countTotalTokens: state.countTotalTokens,
});

// 创建全局状态管理
const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // 合并创建的状态片段
      ...createChatSlice(set, get),
      ...createInputSlice(set, get),
      ...createAuthSlice(set, get),
      ...createConfigSlice(set, get),
      ...createPromptSlice(set, get),
      ...createToastSlice(set, get),
      ...createUserSlice(set, get),
    }),
    {
      name: 'free-chat-gpt',  // 持久化存储名称
      partialize: (state) => createPartializedState(state),  // 部分化存储的状态
      version: 8,  // 存储版本号
      migrate: (persistedState, version) => {
        return persistedState as StoreState;
      },
    }
  )
);

export default useStore;
