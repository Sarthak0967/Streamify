import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { getRecommendedUsers, getFriends, sendFriendRequest, acceptFriendRequests, getFriendRequests, getOutgoingFriendRequests } from '../controllers/user.controller.js';
import { get } from 'mongoose';

const router = express.Router();
router.use(protectedRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getFriends);

router.post("/friend-requests/:id", sendFriendRequest);
router.put("/friend-requests/:id", acceptFriendRequests);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-requests", getOutgoingFriendRequests);


export default router;
