import { useEffect, useState } from "react";
import {Appbar} from "../components/Appbar";
import {Users} from "../components/Users"
import {Balance} from "../components/Balance";
import axios from "axios";
export const Dashboard = () => {
    const [balance,SetBalance] = useState(0);
    const token = localStorage.getItem("token")
    useEffect(() => {
        axios.get("http://20.244.89.70:4000/api/v1/account/balance",{
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