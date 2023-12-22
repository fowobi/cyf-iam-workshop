import { Button } from "@chakra-ui/react";
import  { useAuth } from "oidc-react";


 const LoginButton = () => {
  const auth =useAuth();

  if (auth && auth.userData){
    return(
      <Button bg="red" margin={10} onClick={() => auth.signOut()}>
      Log out
      </Button>
    );
    }
  return(
  <Button bg="green" margin={10} onClick={() => auth.signIn}>
    Log In
  </Button>
);
  };

  export default LoginButton;
