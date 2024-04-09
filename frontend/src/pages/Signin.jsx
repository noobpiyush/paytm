import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Signin = () => {

  const[username,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const navigate = useNavigate();

  const signInUser = async () => {
    try {
      const response = await axios.post("http://20.244.89.70:4000/api/v1/user/signin",{
        username,
        password
      });
      localStorage.setItem("token",response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error && error.response.status === 401) {
        setError("Invalid username or password");
      }else{
        setError("Sign-in falied please try again later")
      }
    }
  }

    return <div className="bg-slate-300  h-screen flex justify-center">
        <div className="flex flex-col justify-center">
           <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
              <Heading label={"Sign in"} />
              <SubHeading label={"Enter your credentials to accsess your account"}/>
              <InputBox 
                onChange={e =>{
                  setUserName(e.target.value);
                }}
                placeholder={"piyushwaghela11@gmail.comm"} label={"Email"}

               />
              <InputBox onChange={e =>{
                    setPassword(e.target.value);
                }} 
               placeholder={"12345"}
               label={"Password"}
               />
               {error && <div className="text-red-500 mt-2" >{error}</div>}
              <div className="mt-5 pt-4">
                <Button
                    onClick={signInUser}
                   label={"Sign in"}
                 />
              </div>
              <BottomWarning label={"Don't have an account ?"} buttonText={"Sign up"} 
                to={"/signup"}
              />
            </div>

        </div>
    </div>
}