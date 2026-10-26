import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";
import { SemesterProvider } from "@/context/SemesterProvider";
import { DialogProvider } from "@/context/DialogProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SemesterProvider>
          <DialogProvider>
            <AppRouter />
          </DialogProvider>
        </SemesterProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
