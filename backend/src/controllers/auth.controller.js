import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";


export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    
    try {
        
        if(!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne( { email});
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${ idx}.png`;

        const newUser = await User({
            email,
            password,
            fullName,
            avatar: randomAvatar
        });


        // Upsert user in Stream
        try {
            await upsertStreamUser({
                id: newUser._id,
                email: newUser.email,
                name: newUser.fullName,
                image: newUser.avatar
            });
            console.log(`Stream user upserted successfully for user ID: ${newUser._id}`);
        } catch (error) {
            console.error("Error upserting Stream user:", error);
            return res.status(500).json({ message: "Failed to create user in Stream" });
            
        }


        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({success: true, user: newUser});

    } catch (error) {
        return res.status(500).json({ message: "Error in signup: Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await user.matchPassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ success: true, user });

    } catch (error) {
        return res.status(500).json({ message: "Error in login: Internal server error" });
        
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error in logout: Internal server error" });
    }
}   

export const onboard = async (req, res) => {
    try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

    if(!fullName || !bio || !location || !nativeLanguage || !learningLanguage) {
        return res.status(400).json({ message: "All fields are required", 
            missingFields: [
                !fullName && "Full name is required",
                !bio && "Bio is required",
                !location && "Location is required",
                !nativeLanguage && "Native language is required",
                !learningLanguage && "Learning language is required",
            ].filter(Boolean),
         })
    }
        // await User.findByIdAndUpdate(req.user._id, {
        //     fullName,
        //     bio,
        //     nativeLanguage,
        //     learningLanguage,
        //     location,
        //     profilePicture: profilePicture 
        // }, { new: true });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,
            },
            { new: true }
        )

        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upsert user in Stream
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || "",
            });
            console.log(`Stream user upserted successfully for user ID: ${updatedUser.fullName}`);
        } catch (error) {
            console.error("Error upserting Stream user:", error);
            return res.status(500).json({ message: "Failed to update user in Stream" });
        }


        res.status(200).json({ success: true, message: "User onboarding successful" ,user: updatedUser });
    } catch (error) {
        console.error("Error in onboarding:", error);
        return res.status(500).json({ message: "Error in onboarding: Internal server error" });
        
    }
}
