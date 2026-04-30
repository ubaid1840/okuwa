
"use server"
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY

export const tokenProvider = async (id) => {
    // console.log(id, apiKey, apiSecret)
    const client = new StreamClient(apiKey, apiSecret);
    const validity = 60 * 60;
    const token = await client.generateUserToken({ user_id : id, validity_in_seconds: validity });
    return token.toString()
}