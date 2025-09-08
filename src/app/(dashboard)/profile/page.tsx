"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useLogout,
  useGetProfile,
  useUpdateProfile,
  useGetSession,
} from "@/hooks/Auth";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfileSchema } from "@/zod-schema/Profile";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingPage from "@/components/LoadingPage";

type ProfileForm = z.infer<typeof ProfileSchema>;

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading: isLoadingUser } = useGetSession();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isSuccess: profileFetched,
  } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutate: logout } = useLogout();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
  });

  const router = useRouter();

  // Watch form values for display
  const formValues = watch();

  useEffect(() => {
    if (profileFetched && profileData) {
      const profileValues = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      };
      reset(profileValues);
    }
  }, [profileFetched, profileData, reset]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    if (profileData) {
      reset({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });
    }
  }

  function onSubmit(data: ProfileForm) {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  }

  if (isProfileLoading || isLoadingUser) {
    return <LoadingPage message="Loading profile..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0 pt-6 sm:pt-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-800">
            Profile Settings
          </h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">
            Personal Information
          </h2>
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="sm">
              Edit
            </Button>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          {/* Profile Avatar Placeholder */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
              {formValues.firstName?.[0] || "F"}
              {formValues.lastName?.[0] || "L"}
            </div>
            <div className="text-sm text-slate-600">
              Profile picture coming soon
            </div>
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-slate-700"
            >
              First Name
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  {...register("firstName")}
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900">
                {formValues.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-slate-700"
            >
              Last Name
            </Label>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  {...register("lastName")}
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900">
                {formValues.lastName}
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Email Address
            </Label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-600">
              {user?.email}
            </div>
            <p className="text-xs text-slate-500">
              Contact support to change your email address
            </p>
          </div>

          {/* Edit Controls */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 pr-0 sm:pr-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">
              Sign Out
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Sign out of your account on this device. You can sign back in at
              any time.
            </p>
          </div>

          <Button onClick={() => logout()} variant="destructive">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
