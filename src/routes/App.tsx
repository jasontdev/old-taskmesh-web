import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UsersTasklists from "../components/UsersTasklists";

export default function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");

  const { data } = useQuery(["tasklists"], {
    enabled: accessToken !== "",
    queryFn: async () => {
      return axios
        .get(`http://localhost:8080/user/${accounts[0].localAccountId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data);
    },
  });

  useEffect(() => {
    instance
      .acquireTokenSilent({
        scopes: ["api://4f960b5c-b3c5-44fb-89bc-f13cae3b20b1/User"],
        account: accounts[0],
      })
      .then((response) => setAccessToken(response.accessToken))
      .catch((error) => instance.loginPopup());
    // TODO: trigger re-fetch
  }, []);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="grid grid-cols-4 grid-rows-4 h-full">
        <div className="col-span-1 row-span-4">
          {data && data.tasklists ? (
            <UsersTasklists tasklists={data.tasklists} />
          ) : null}
        </div>
        <div className="col-span-3 row-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
