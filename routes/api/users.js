const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

// @route GET api/users
// @desc Get ALl users
// @access Public

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
});

// @route POST api/users
// @desc Register User
// @access Public

router.post(
    "/",
    [
        check("name", "Name is Required")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or characters"
        ).isLength({ min: 6 }),
        check("userType", "Not a valid user type")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // 400 - Bad request
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, userType } = req.body;

        // TODO - Remove Admin and Transport from array
        // ALSO CHECK HTTP RESPONSE CODE

        if (["farmer", "buyer", "admin", "transport"].indexOf(userType) == -1) {
            return res.status(403).json({
                errors: [
                    {
                        msg: "Wrong User Type"
                    }
                ]
            });
        }
        try {
            // Check if user already exist

            const user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }

            const newUser = new User({
                name,
                email,
                password,
                userType
            });

            // Encrypt Password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            newUser.password = hash;

            await newUser.save();
            const payload = {
                user: {
                    id: newUser.id,
                    userType: newUser.userType
                }
            };

            // return jsonwebtoken
            jwt.sign(
                payload,
                config.get("jwtSecretKey"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    return res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            // 500 - Server Error
            return res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
