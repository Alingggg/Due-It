import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";
import { DialogProvider } from "@/context/DialogProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DialogProvider>
          <AppRouter />
        </DialogProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
