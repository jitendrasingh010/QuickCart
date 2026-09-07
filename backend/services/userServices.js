const userRepo = require('../repositories/userRepo.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadImage } = require('../utils/cloudnary.js');
const transporter = require("../utils/nodemailer");

const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

exports.createUser = async (userData) => {
    const existingUser = await userRepo.findUserByEmail(userData.email);
    if (existingUser) {
        throw createError('User already exists with this email', 409);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    return await userRepo.createUser(userData);
};

exports.loginUser = async (email, password) => {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        throw createError('Please signup first. User not found.', 404);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError('Wrong password', 401);
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    return { user, token };
};

exports.googleLoginUser = async (firebaseToken) => {
    const decodedToken = jwt.decode(firebaseToken);
    if (!decodedToken || !decodedToken.email) {
        throw createError('Invalid Google token', 401);
    }

    const email = decodedToken.email;
    let user = await userRepo.findUserByEmail(email);

    if (!user) {
        const name = decodedToken.name || "";
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || email.split("@")[0] || "Google";
        const lastName = nameParts.slice(1).join(" ") || "User";

        const generatedPassword = await bcrypt.hash(decodedToken.user_id || Math.random().toString(36), 10);

        user = await userRepo.createUser({
            firstName,
            lastName,
            email,
            password: generatedPassword,
            phone: decodedToken.phone_number || "0000000000",
            profileImage: decodedToken.picture || null,
            role: "customer",
            status: "active",
        });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user, token };
};

exports.getUserProfile = async (userId) => {
    const user = await userRepo.findUserById(userId);
    if (!user) {
        return null;
    }
    return {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender || null,
        profileImage: user.profileImage || null,
        role: user.role,
        createdAt: user.createdAt,
    };
};

exports.updateProfile = async (userId, data, file) => {
    const {
        firstName,
        lastName,
        phone,
        gender,
    } = data;

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;

    if (file) {
        const result = await uploadImage(file, "QuickCart/Users");
        updateData.profileImage = result.secure_url;
    } else if (data.profileImage !== undefined && data.profileImage !== "") {
        updateData.profileImage = data.profileImage;
    }

    await userRepo.updateProfile(userId, updateData);
    return true;
};

exports.changePassword = async (userId, passwordData) => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw createError("All fields are required", 400);
    }

    if (newPassword !== confirmPassword) {
        throw createError("Passwords do not match", 400);
    }

    const user = await userRepo.getUserById(userId);

    if (!user) {
        throw createError("User not found", 404);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
        throw createError("Old password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.updatePassword(userId, hashedPassword);
    return true;
};

exports.getAllCustomers = async (queryOptions = {}) => {
    return await userRepo.getAllCustomers(queryOptions);
};

exports.getCustomerById = async (id) => {
    const customer = await userRepo.getCustomerDetailsById(id);

    if (!customer) {
        throw createError("Customer not found", 404);
    }

    const orders = customer.Orders || [];
    const totalOrders = orders.length;
    const totalSpending = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    return {
        customer: {
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            gender: customer.gender || null,
            role: customer.role,
            status: customer.status,
            profileImage: customer.profileImage || null,
            createdAt: customer.createdAt,
        },
        summary: {
            totalOrders,
            totalSpending,
            lastOrderDate,
            status: customer.status,
        },
        recentOrders: orders,
    };
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.forgotPassword = async (email) => {
    if (!email) {
        throw createError("Email is required", 400);
    }

    const user = await userRepo.findUserByEmail(email);

    if (!user) {
        throw createError("User not found with this email", 404);
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await userRepo.saveOTP(
        user.id,
        otp,
        expiry
    );

    await transporter.sendMail({
        from: `"QuickCart" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: "QuickCart Password Reset OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });

    return {
        message: "OTP sent successfully",
    };
};

exports.verifyOTP = async (email, otp) => {
    if (!email || !otp) {
        throw createError("Email and OTP are required", 400);
    }

    const user = await userRepo.findUserByEmail(email);

    if (!user) {
        throw createError("User not found", 404);
    }

    if (user.resetOtp !== otp) {
        throw createError("Invalid OTP", 400);
    }

    if (new Date() > new Date(user.resetOtpExpiry)) {
        throw createError("OTP has expired. Please request a new one.", 400);
    }

    return {
        message: "OTP verified successfully",
    };
};

exports.resetPassword = async (email, newPassword, confirmPassword) => {
    if (!email || !newPassword || !confirmPassword) {
        throw createError("All fields are required", 400);
    }

    if (newPassword !== confirmPassword) {
        throw createError("Passwords do not match", 400);
    }

    const user = await userRepo.findUserByEmail(email);

    if (!user) {
        throw createError("User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepo.updatePassword(user.id, hashedPassword);
    await userRepo.saveOTP(user.id, null, null);

    return {
        message: "Password updated successfully",
    };
};