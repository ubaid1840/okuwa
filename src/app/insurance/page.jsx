"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "../loading"

export default function Page () {
    const router = useRouter()
    useEffect(()=>{
        router.push('/insurance/dashboard')
    },[])
    return (
        <Loading />
    )
  
}