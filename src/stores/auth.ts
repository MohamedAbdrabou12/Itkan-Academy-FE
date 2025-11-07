import type {
  JWTTokenDecodedContent,
  LoginResponse,
  Permission,
  User,
} from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: User | null;
  access_token: string | null;
}

interface AuthActions {
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  getUserPermission: () => Permission[] | null;
}
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      login: (loginResponse) => {
        set({
          user: loginResponse.user,
          access_token: loginResponse.access_token,
        });
      },

      logout: () => {
        set({
          user: null,
          access_token: null,
        });
      },

      getUserPermission: () => {
        const { access_token } = get();
        if (!access_token) return null;
        const userData: JWTTokenDecodedContent = jwtDecode(access_token);
        return userData.permissions;
      },
    }),
    {
      name: "auth-serivce",
    },
  ),
);
