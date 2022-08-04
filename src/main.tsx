import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./routes/App";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { QueryClient , QueryClientProvider} from "@tanstack/react-query";
import CreateTasklist from "./routes/CreateTasklist";
import TasklistRoute from "./routes/TasklistRoute";

const msalConfig = {
  auth: {
    clientId: "4f960b5c-b3c5-44fb-89bc-f13cae3b20b1",
    authority: "https://login.microsoftonline.com/consumers",
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/create-tasklist" element={<CreateTasklist />} />
            <Route path="/tasklist/:id" element={<TasklistRoute />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </MsalProvider>
);
