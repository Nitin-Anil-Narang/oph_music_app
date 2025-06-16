
import React, { useEffect, useState } from "react";
import SignUpForm from "./components/SignUpForm";
import { useArtist } from "../API/ArtistContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
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
      <SignUpForm />
    </div>
  );
}

export default SignUp;
