import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDBStorage } from "@/utils/IndexedDBStorage";
import type { Profile } from "@/types/base";
import type { AllUserData } from "@/types";
interface AuthStore {
  allUserData: AllUserData | null;
  profile: Profile | null;
  loading: boolean;
  cart_count: number;
  hydrated: boolean;
  isTeacher: () => boolean;
  user: () => { user_id: string | null; username: string | null };
  setProfile: (p: Profile | null) => void;
  setUser: (user: AuthStore["allUserData"]) => void;
  setCartCount: (cart_count: number) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  isLoggedIn: () => boolean;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        allUserData: null,
        loading: false,
        cart_count: 0,
        hydrated: false,
        profile: null,
        isTeacher: () => {
          if (Number(get().allUserData?.teacher_id) !== 0) {
            return true;
          }
          return false;
        },
        user: () => ({
          user_id: get().allUserData?.user_id || null,
          username: get().allUserData?.username || null,
        }),
        setProfile: (p: Profile | null) =>
          set({ profile: p }, undefined, "setProfile"),
        setUser: (user) =>
          set(
            {
              allUserData: user,
            },
            undefined,
            "setUser"
          ),
        setCartCount: (count) =>
          set({ cart_count: count }, undefined, "setCartCount"),
        setLoading: (loading) => set({ loading }, undefined, "setLoading"),
        setHydrated: (hydrated) => set({ hydrated }, undefined, "setHydrated"),
        isLoggedIn: () => get()?.allUserData !== null,
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => indexedDBStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
        // 版本控制，用于数据迁移
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // 如果是从旧版本迁移，确保数据格式正确
          if (version === 0) {
            console.log("迁移auth-store数据格式到版本1");
          }
          return persistedState;
        },
      }
    ),
    {
      name: "Auth Store", // DevTools中显示的名称
    }
  )
);

export { useAuthStore };
