import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./AppRouter";
import { SemesterProvider } from "@/context/SemesterProvider";
import { DialogProvider } from "@/context/DialogProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SemesterProvider>
        <DialogProvider>
          <AppRouter />
        </DialogProvider>
      </SemesterProvider>
    </QueryClientProvider>
  );
}

export default App;
