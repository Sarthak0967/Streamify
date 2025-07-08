import { StreamChat } from "stream-chat";
import "dotenv/config.js";


const streamSecret = process.env.STREAM_API_SECRET;
const streamApiKey = process.env.STREAM_API_KEY;

if(!streamSecret || !streamApiKey) {
    throw new Error("Stream API or API Key is not defined in environment variables");
}

const streamClient = StreamChat.getInstance(
    streamApiKey,
    streamSecret,
    {
        timeout: 10000, // 10 seconds timeout
    }
);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error in upsertStreamUser:", error);
        throw new Error("Failed to upsert Stream user");
        
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        if (!userIdString) {
            throw new Error("User ID is required to generate Stream token");
        }
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw new Error("Failed to generate Stream token");
        
    }
}

