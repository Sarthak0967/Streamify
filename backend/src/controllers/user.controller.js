import User from '../models/User.model.js';
import FriendRequest from '../models/FriendRequest.model.js';

export const getRecommendedUsers = async(req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: { $ne: currentUserId}},
                {_id: { $nin: currentUser.friends}},
                {isOnboarded: true}
            ],
        })
        // console.log("Recommended users:", recommendedUsers);
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePicture nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: receiverId } = req.params;
        
        if (myId === receiverId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }


        const receiver = await User.findById (receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        if (receiver.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, receiver: receiverId },
                { sender: receiverId, receiver: myId }
            ],
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        const friendRequest = new FriendRequest({
            sender: myId,
            receiver: receiverId
        });

        await friendRequest.save();

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const acceptFriendRequests = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }


        if(friendRequest.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add the sender to the receiver's friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.receiver }
        })
        // Add the receiver to the sender's friends list
        await User.findByIdAndUpdate(friendRequest.receiver, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted successfully." });

    } catch (error) {
        console.error("Error accepting friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const incomingRequests = await FriendRequest.find({
            receiver: req.user.id,
            status: 'pending'
        }).populate('sender', 'fullName profilePicture nativeLanguage learningLanguage');

        const acceptFriendRequests = await FriendRequest.find({
            sender: req.user.id,
            status: 'accepted'
        }).populate('receiver', 'fullName profilePicture');

        res.status(200).json({ incomingRequests, acceptFriendRequests });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getOutgoingFriendRequests = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: 'pending'
        }).populate('receiver', 'fullName profilePicture nativeLanguage learningLanguage');

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}