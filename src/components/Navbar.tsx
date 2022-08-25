import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Button, Flex, Heading } from "@chakra-ui/react";

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
    <Flex
      justifyContent="space-between"
      px="1rem"
      py="0.25rem"
      bgColor="darkslateblue"
      alignItems="center"
      color="white"
    >
      <Heading as="h1" size="md">
        TASKMESH.XYZ
      </Heading>
      <div>
        {isAuthenticated ? (
          <Button colorScheme="white" variant="outline" onClick={handleSignout}>
            SIGN OUT
          </Button>
        ) : (
          <Button colorScheme="white" onClick={handleLogin}>
            SIGN IN
          </Button>
        )}
      </div>
    </Flex>
  );
}
