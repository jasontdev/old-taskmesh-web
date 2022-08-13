import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import Layout from "./components/pages/Layout";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateTasklist from "./routes/CreateTasklist";

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
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<App />} />
          </Route>
          <Route path="/create-tasklist" element={<Layout />}>
            <Route path="/create-tasklist" element={<CreateTasklist />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </MsalProvider>
);
