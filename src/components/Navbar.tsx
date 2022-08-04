import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";

export default function Navbar() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  function handleLogin() {
    instance.loginPopup().catch((e) => console.log(e));
  }

  function handleSignout() {
    instance.logout().then((r) => console.log("Logging out"));
  }

  return (
    <div className="flex justify-between px-5 py-1 bg-gray-700 text-white">
      <div className="font-bold">TASKMESH.XYZ</div>
      <div>
        {isAuthenticated ? (
          <button onClick={handleSignout} className="font-bold hover:text-sky-500">SIGN OUT</button>
        ) : (
          <button onClick={handleLogin} className="font-bold hover:text-sky-500">SIGN IN</button>
        )}
      </div>
    </div>
  );
}
