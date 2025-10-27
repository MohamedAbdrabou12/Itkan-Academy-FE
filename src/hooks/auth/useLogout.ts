import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      return await apiReq("POST", "/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      console.log("Error in Logout: ", err);
      toast(err.message, { type: "error" });
    },
  });

  return { logout };
}
