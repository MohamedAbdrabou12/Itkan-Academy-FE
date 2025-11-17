import type {
  JWTTokenDecodedContent,
  LoginResponse,
  JWTPermission,
  User,
} from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type { JWTBranch } from "@/types/Branches";
import { UserRole } from "@/types/Roles";

interface AuthState {
  user: User | null;
  access_token: string | null;
  branches: JWTBranch[];
  activeBranch: JWTBranch | null;
}

interface AuthActions {
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  getUserPermission: () => JWTPermission[] | null;
  setActiveBranch: (branch: JWTBranch) => void;
}
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      branches: [],
      activeBranch: null,

      login: (loginResponse) => {
        const user = loginResponse.user;
        const access_token = loginResponse.access_token;
        let branches: JWTBranch[] = [];
        let activeBranch = null;

        if (loginResponse.user.role_name != UserRole.STUDENT) {
          const jwtData = jwtDecode<JWTTokenDecodedContent>(
            loginResponse.access_token,
          );
          branches = jwtData.branches;
          activeBranch = branches[0];
        }
        set({
          user,
          access_token,
          branches,
          activeBranch,
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
      setActiveBranch: (branch) => {
        set({
          activeBranch: branch,
        });
      },
    }),
    {
      name: "auth-serivce",
    },
  ),
);
