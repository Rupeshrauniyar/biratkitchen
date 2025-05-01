const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AdminModel = require("../../models/admin-model");


const adminSignup = async (req, res) => {
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
                        const newAdmin = await AdminModel.create({ full_name, ph_num, email, password: hash });
                        if (newAdmin) {
                            const token = jwt.sign({ adminId: newAdmin._id }, process.env.ADMIN_SECRET);


                            res.status(201).json({ message: "Admin created successfully", admin: newAdmin, token });
                        } else {
                            res.status(400).json({ message: "Admin creation failed" });
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

const adminSignin = async (req, res) => {
    try {

        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ adminId: admin._id }, process.env.ADMIN_SECRET);
        res.status(200).json({
            status: "OK", message: "Admin logged in successfully", admin, token
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server errorrrr" });
    }

};

const checkAdmin = async (req, res) => {
    try {
        const admin = req.admin
        if (admin && admin?._id) {
            res.json({ status: "OK", admin, verified: true })
        } else {
            res.json({ status: "BAD", verified: false })

        }

    } catch (err) {
        res.json({ status: "BAD", verified: false })

    }
}

module.exports = { adminSignup, adminSignin, checkAdmin };



