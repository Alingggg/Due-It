import { ProtectedLayout, PublicLayout, WorkspaceLayout } from "@/components";
import {
  GetStarted,
  MaterialDetails,
  Materials,
  Members,
  Profile,
  Settings,
  SignIn,
  SignUp,
  Subjects,
  TaskDetails,
  Tasks,
} from "@/pages";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Navigate to="/sign-in" replace />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="get-started" element={<GetStarted />} />
          <Route path="profile" element={<Profile />} />
          <Route path="workspace/:workspaceId" element={<WorkspaceLayout />}>
            <Route path="tasks">
              <Route index element={<Tasks />} />
              <Route path=":taskId" element={<TaskDetails />} />
            </Route>
            <Route path="materials">
              <Route index element={<Materials />} />
              <Route path=":materialGroupId" element={<MaterialDetails />} />
            </Route>
            <Route path="subjects" element={<Subjects />} />
            <Route path="members" element={<Members />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
