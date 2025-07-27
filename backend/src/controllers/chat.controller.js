import { generateStreamToken } from "../lib/stream.js";
import logger from '../lib/logger.js';


export const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });
    } catch (error) {
        logger.error("Error generating Stream token: %s", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}