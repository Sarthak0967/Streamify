import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    nativeLanguage: {
        type: String,
        default: ''
    },
    learningLanguage: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Prehook: Hash the password before saving the user model
userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

// Method to compare passwords
userSchema.methods.matchPassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

const User = mongoose.model('User', userSchema);
export default User;