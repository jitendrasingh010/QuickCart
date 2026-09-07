const userService = require('../services/userServices.js');

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;
        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newUser = await userService.createUser({ firstName, lastName, email, password, phone, role });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const { user, token } = await userService.loginUser(email, password);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        const { user, token: appToken } = await userService.googleLoginUser(token);
        res.cookie("token", appToken, cookieOptions);
        res.status(200).json({ message: 'Login successful', user, token: appToken });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("token", clearCookieOptions);
    res.status(200).json({ message: "Logout successful" });
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfile = await userService.getUserProfile(userId);

        if (!userProfile) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user: userProfile,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        await userService.updateProfile(userId, req.body, req.file);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update profile",
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        await userService.changePassword(userId, req.body);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const { search, sort } = req.query;
        const customers = await userService.getAllCustomers({ search, sort });

        return res.status(200).json({
            success: true,
            message: "Customers fetched successfully",
            data: customers,
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerData = await userService.getCustomerById(id);

        return res.status(200).json({
            success: true,
            message: "Customer details fetched successfully",
            data: customerData,
        });
    } catch (error) {
        console.error("Error fetching customer details:", error);
        return res.status(404).json({
            success: false,
            message: error.message || "Customer not found",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.forgotPassword(email);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await userService.verifyOTP(email, otp);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        const result = await userService.resetPassword(email, newPassword, confirmPassword);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};