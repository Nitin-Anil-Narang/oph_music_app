import { useNavigate } from "react-router-dom"
import React from "react";



export default function Error(){
  const navigate = useNavigate();
    return(
        <>
         <div className="text-center flex flex-col justify-center items-center h-[80vh] w-full ">
           <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">ERROR 404 PAGE NOT FOUND</h1>
           <button onClick={()=>{navigate('/dashboard')}}  className="px-5 py-2 bg-cyan-400 text-black mt-4 rounded-full">Go Back</button>
         </div>
        </>
    )
}