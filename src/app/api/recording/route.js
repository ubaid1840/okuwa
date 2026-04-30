const crypto = require('crypto');
import { errors } from '@/data/data';
//Signature=md5(AppId + SignatureNonce + ServerSecret + Timestamp)



import pool from '@/lib/db'; // Import PostgreSQL pool connection
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const timeStamp = Math.round(Date.now()/1000)
        const appID = "1764104378"
        const secret = "45b859d893c301685e64b099f3cd1af9"
        const signatureNonce = crypto.randomBytes(8).toString('hex')

        const response = GenerateUASignature(appID, signatureNonce, secret, timeStamp)
        return NextResponse.json(
            { response : response,
                timeStamp : timeStamp,
                appID : appID,
                secret : secret,
                sign : signatureNonce
             },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message : errors[1] },
            { status: 500 }
        );
    }
}


function GenerateUASignature(appId, signatureNonce, serverSecret, timeStamp) {
    const hash = crypto.createHash('md5'); //Use the MD5 hashing algorithm.
    var str = appId + signatureNonce + serverSecret + timeStamp;
    hash.update(str);
    return hash.digest('hex');
}

export const revalidate = 0;

