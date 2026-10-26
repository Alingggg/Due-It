import { useGetUserWorkspace } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Profile } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      await api.post("/auth/register", data);
    },
    onError: (error) => {
      console.log("Error during registration:", error);
    },
  });
}

function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      await api.post("/auth/login", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      navigate("/get-started");
    },
    onError: (error) => {
      console.log("Error during login:", error);
    },
  });
}

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/sign-in");
    },
    onError: (error) => {
      console.log("Error during logout:", error);
    },
  });
}

function useGetProfile() {
  return useQuery({
    queryKey: queryKeys.profile.detail(),
    queryFn: async () => (await api.get<Profile>("/auth/me")).data,
    retry: false,
  });
}

function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      await api.patch("/auth/me", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.list(workspace?.id || ""),
      });
    },
    onError: (error) => {
      console.log("Error updating profile:", error);
    },
  });
}

export {
  useRegister,
  useLogin,
  useLogout,
  useGetProfile,
  useUpdateProfile,
};
