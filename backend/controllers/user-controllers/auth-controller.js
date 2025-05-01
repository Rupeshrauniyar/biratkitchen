const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../../models/user-model");


const userSignup = async (req, res) => {
    try {
        const { full_name, ph_num, email, password } = req.body
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            } else {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        return res.status(500).json({ message: "Internal server error" });
                    }
                    try {
                        const newuser = await userModel.create({ full_name, ph_num, email, password: hash });
                        if (newuser) {
                            const token = jwt.sign({ userId: newuser._id }, process.env.USER_SECRET);
                            res.cookie("token", token, {
                                httpOnly: true,
                                secure: true, // set to true in production with HTTPS
                                sameSite: "None",
                                maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
                            });

                            res.status(201).json({ message: "user created successfully", user: newuser, token });
                        } else {
                            res.status(400).json({ message: "user creation failed" });
                        }
                    } catch (err) {
                        if (err.keyPattern.ph_num === 1) {
                            res.status(400).json({ message: "Phone number already exists" });
                        }
                        if (err.keyPattern.email === 1) {
                            res.status(400).json({ message: "Email already exists" });
                        }
                    }

                })
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }

};

const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET);
        if (token) {
            res.status(200).json({ status: "OK", message: "user logged in successfully", user, token });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }

};

const checkuser = async (req, res) => {
    try {
        const user = req.user
        if (user && user?._id) {
            res.json({ status: "OK", user, verified: true })
        } else {
            res.json({ status: "BAD", verified: false })

        }

    } catch (err) {
        res.json({ status: "BAD", verified: false })

    }
}

module.exports = { userSignup, userSignin, checkuser };



