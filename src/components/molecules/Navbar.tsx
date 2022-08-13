import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Button } from "../atoms/Button";

export default function Navbar() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().catch((e) => console.log(e));
  };

  const handleSignout = () => {
    instance.logout().then((r) => console.log("Logging out"));
  };

  return (
    <div className="flex justify-between px-5 py-1 bg-gray-700 text-white">
      <div className="font-bold">TASKMESH.XYZ</div>
      <div>
        {isAuthenticated ? (
          <Button text="Sign Out" onClick={handleSignout} />
        ) : (
          <Button text="Sign In" onClick={handleLogin} />
        )}
      </div>
    </div>
  );
}
