/* eslint-disable react/prop-types */
import { Alert, AlertIcon, Spinner, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Cat from "./Cat";
import { useAuth } from "oidc-react";

const CatList = ({ subscription }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    async function getCats() {
      try {
        setLoading(true);
        setError(false);
      
        let headers = {};
        if (auth && auth.userData){
          headers = {
            Authorization: `Bearer ${auth.userData.access-token}`,
          };
        }


        const response = await fetch(
          "http://localhost:3000/cats/" + subscription,
          { headers: headers}
        );
        if (!response.ok) {
          setError(true);
          console.error("Unable to fetch cats", response);
        }

        const jsonData = await response.json();

        setCats(jsonData);
        setLoading(false);
      } catch {
        setError(true);
      }
    }
    getCats();
  }, []);
  if (subscription !== "free"){
    if (! auth || auth.userData){
      return(
        <Alert status="error">
          <AlertIcon/>
          You must be authenticated to see these cats
        </Alert>
      )
    }
  }
if (subscription ==="super-premium"){
  if (!auth.userData.profile.roles.includes("Catlover")){
    return (
      <Alert status="error">
        <AlertIcon />
        You must be cat lover to see these cats
      </Alert>
    );
  }
}
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Problem loading cats
      </Alert>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  const catDisplay = [];
  for (const cat of cats) {
    catDisplay.push(<Cat cat={cat} key={cat.name} />);
  }

  return <Stack>{catDisplay}</Stack>;
};

export default CatList;