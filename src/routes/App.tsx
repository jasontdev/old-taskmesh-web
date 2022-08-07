import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import UsersTasklists from "../components/UsersTasklists";
import { getUser } from "../queries";

export default function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  const { data } = useQuery(["tasklists"], {
    enabled: accessToken !== "",
    queryFn: () => {
      return getUser(accounts[0].localAccountId, accessToken);
    },
  });

  useEffect(() => {
    instance
      .acquireTokenSilent({
        scopes: ["api://4f960b5c-b3c5-44fb-89bc-f13cae3b20b1/User"],
        account: accounts[0],
      })
      .then((response) => setAccessToken(response.accessToken))
      .catch(() => instance.loginPopup());
    // TODO: trigger re-fetch
  }, []);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="grid grid-cols-4 grid-rows-4 h-full">
        <div className="col-span-1 row-span-4 flex flex-col">
          {data && data.tasklists ? (
            <UsersTasklists tasklists={data.tasklists} />
          ) : null}
          <button
            className="bg-blue-400 px-8 py-1 text-white mx-auto"
            onClick={() => navigate("/create-tasklist")}
          >
            Add
          </button>
        </div>
        <div className="col-span-2 row-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
