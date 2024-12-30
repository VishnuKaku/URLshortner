// User model 
// src/models/User.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: { type: String, required: false },
    apiKey: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// Define the generateAuthToken method
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    return token;
};
export const User = mongoose.model('User', userSchema);
