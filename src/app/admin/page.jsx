'use client'
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "../loading"


export default function Page () {

    const pathname = usePathname()
    const router = useRouter()
   

    useEffect(()=>{
        router.push(`${pathname}/dashboard`)
    },[])
    return (
        <Loading />
    )
  
}