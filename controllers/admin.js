const bcryptJs = require("bcryptjs");
const { Admin, validateAdmin, generateToken, validateOnSignIn } = require("../model/admin");


module.exports = {
    signup: async (req, res, next) => {
        const { error, value } = validateAdmin(req.body);
        if (error) return res.status(422).json({ message: error.details[0].message });

        const { firstname, lastname, email, phone, role, password } = value;

        //check if email already exist
        const oldUser = await Admin.findOne({ email });
        if (oldUser) return res.status(422).json({ message: "User with such email already exist" })

        if (!req.file) return res.status(422).json({ message: "no image uploaded" });
        const image = req.file.path;

        let admin = await new Admin({ firstname, lastname, email, phone, role, password, image });
        admin = await admin.save();
        if (!admin) return res.status(400).json({ message: "something went wrong saving user" });

        res.json({ message: "successfully added", admin })
    },
    signin: async (req, res, next) => {
        const { error, value } = validateOnSignIn(req.body);
        if (error) return res.status(422).json({ message: error.details[0].message })

        const { email, password } = value;

        //check if email exist
        const admin = await Admin.findOne({ email }).select("-__v");
        if (!admin) res.status(422).json({ message: "email does not exist" });

        //validate password
        const isPassword = await bcryptJs.compare(password, admin.password);
        if (!isPassword) return res.status(422).json({ message: "password is incorrect" });

        const token = generateToken(admin._id);
        res.json({ admin, token });

    },
    getAllAdmin: async (req, res, next) => {
        const admin = await Admin.find().select("-__v");
        if (admin.length < 1) return res.status(200).json({ message: "no admin user available" });
        res.json({ admin })
    }
}