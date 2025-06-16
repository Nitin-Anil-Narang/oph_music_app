
import React, { useEffect, useState } from "react";
import SignInForm from "./components/SignInForm/SignInForm";
import { useArtist } from "../API/ArtistContext";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const [verified,setVerified] = useState(false);

  const {headers} = useArtist();
  const navigate = useNavigate();
   useEffect(()=>{

    if (!headers || !headers.Authorization) {
      setVerified(false);
    }
    else{
      setVerified(true);
      navigate('/dashboard')
    }

   },[useArtist])
  return (
    <div>
      <SignInForm />
    </div>
  );
}

export default SignIn;
