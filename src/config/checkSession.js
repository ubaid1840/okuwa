import { app, auth, db } from "@/config/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import Cookies from "js-cookie";
import axios from '@/lib/axiosInstance';

export default function useCheckSession() {
    const router = useRouter();
    const pathname = usePathname()

    const checkSession = async () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async user => {
                if (user) {
                    if (user.email) {
                        if (user.email == 'superadmin@gmail.com') {
                            resolve({ user: { ...user }, status: true })
                        } else {
                            await axios.post("/api/mydetail", {
                                email: user.email
                            }).then(async (response) => {
                                if(response.data?.insuranceid){
                                    resolve({ user: { ...response.data, ...user }, status: true, insurance : true })
                                } else {
                                    resolve({ user: { ...response.data, ...user }, status: true, })
                                }
                                // if (!pathname.includes(response?.data?.role?.toLowerCase())) {
                                //     router.push(`/${response?.data?.role?.toLowerCase()}`)
                                // }
                               
                            }).catch((e) => {
                                signOut(auth)
                                if (e.response && e.response.data) {
                                    console.log(e.response.data.message)
                                }
                            })
                        }
                    }

                } else {
                    if (pathname.includes('admin') || pathname.includes('frontdesk') || pathname.includes('doctor') || pathname.includes('finance') || pathname.includes('lab') || pathname.includes('nurse') || pathname.includes('internal') || pathname.includes('insurance')) {
                        router.push('/login')
                    }
                    resolve({ status: false })
                }
            })
            return () => {
                unsubscribe()
            }
        })
    };

    return checkSession;
}