import { useState } from "react";
import "./App.css";
import { Flex, Center, Link, Stack, Box } from "@chakra-ui/react";
import CatList from "./CatList";
import LoginButton from "./LoginButton";
import {AuthProvider} from "oidc-react";

function App() {
  const [selectedCats, setSelectedCats] = useState("free");
  const oidcConfig = {
    onSignIn: () => {
      window.history.replacestate({}, "", "/");
    },
    authority: "https://login.microsoftonline.com/38fe53c5-4996-4c46-8a0d-b2ef2eb9fdb7/v2.0",
    clientId: "95bcf529-1242-4ed2-874f-867e9f676370",
    redirectUri: "http://localhost:5173",
    autoSignIn: false,
    scope: "api://95bcf529-1242-4ed2-874f-867e9f676370/Cats.Read"
  };

  return (
    <AuthProvider {...oidcConfig}>
      <Flex>
        <Box minW="200px" w="20%" bgColor="#eeeeee">
          <Stack>
            <Link onClick={() => setSelectedCats("free")} _hover={{ background: "#cccccc" }} marginTop={5}>
              <Center>Free Cats</Center>
            </Link>
            <Link onClick={() => setSelectedCats("premium")} _hover={{ background: "#cccccc" }}>
              <Center>Premium Cats</Center>
            </Link>
            <Link onClick={() => setSelectedCats("super-premium")} _hover={{ background: "#cccccc" }}>
              <Center>Super-Premium Cats</Center>
            </Link>
            <LoginButton />
          </Stack>
        </Box>
        <Center w="80%">
          <CatList subscription={selectedCats} key={selectedCats} />
        </Center>
      </Flex>
    </AuthProvider>
  );
}

export default App;
