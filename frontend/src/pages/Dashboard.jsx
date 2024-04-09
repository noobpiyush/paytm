import { useEffect, useState } from "react";
import {Appbar} from "../components/Appbar";
import {Users} from "../components/Users"
import {Balance} from "../components/Balance";
import axios from "axios";
import { url } from "../globalApi";
export const Dashboard = () => {
    const [balance,SetBalance] = useState(0);
    const token = localStorage.getItem("token")
    useEffect(() => {
        console.log(`${url}/api/v1/account/balance`);
        axios.get(`${url}/api/v1/account/balance`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            SetBalance(Math.round(res.data.balance));
        })
    },[token])
    return <div>
       <Appbar/>
       <div className="m-8">
            <Balance value={balance} />
            <Users/>
       </div>
    </div>
}