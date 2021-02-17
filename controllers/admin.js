const bcryptJs = require("bcryptjs");
const { Admin, validateAdmin, generateToken, validateOnSignIn } = require("../model/admin");
const transporter = require("../handlers/mailer");

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

        await transporter.sendMail({
            from: "noreply@chidex.com",
            to: email,
            subject: "Garnetcare Foundation",
            html: `
            
            <body style="box-sizing: border-box; margin: 0; padding: 0" ;>
            <main>
                <div class="body-details">
                    <section style="text-align: center">
                        <a href="#" rel="noreferrer noopener">
                            <img src="https://www.garnetcarefoundation.org/img/GCF-color.svg" alt="logo"
                                style="width: 130px; height: 75px; padding: 20px 10px 20px" />
                        </a>
                    </section>
        
                    <div style="border-top: 2px solid #694a98; width: 50%; margin: auto">
                        <table style="width: 100%">
                            <tr>
                                <th style="
                          padding: 1rem 0.5rem;
                          border: 1px solid #eee;
                          box-shadow: 2px 2px 10px #00000040;
                          color: #694a98;
                        ">
                                    Educate
                                </th>
                                <th style="
                          padding: 1rem 0.5rem;
                          border: 1px solid #eee;
                          box-shadow: 2px 2px 10px #00000040;
                          color: #694a98;
                        ">
                                    Gender Equality
                                </th>
                                <th style="
                          padding: 1rem 0.5rem;
                          border: 1px solid #eee;
                          box-shadow: 2px 2px 10px #00000040;
                          color: #694a98;
                        ">
                                    Help Rape Victims
                                </th>
                                <th style="
                          padding: 1rem 0.5rem;
                          border: 1px solid #eee;
                          box-shadow: 2px 2px 10px #00000040;
                          color: #694a98;
                        ">
                                    Skills Acquisition
                                </th>
                                <th style="
                          padding: 1rem 0.5rem;
                          border: 1px solid #eee;
                          box-shadow: 2px 2px 10px #00000040;
                          color: #694a98;
                        ">
                                    Health Care
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <div class="flex-container">
                            <div style="width: 50%; height: 20%; margin: auto">
                                <img src="https://pbs.twimg.com/media/D2FrpoDWoAEbi9D.jpg" style="
                          width: 100%;
                          height: 300px;
                          object-fit: cover;
                          margin-top: 0.3rem;
                        " />
                            </div>
                        </div>
                        <p style="
                      text-align: left;
                      width: 50%;
                      margin: 2rem auto;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">
                            Hello, ${firstname} ${lastname}
                        </p>
                        <p style="
                      line-height: 3;
                      margin: 2rem auto;
                      width: 50%;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">
                            Thank you for subscribing to our newsletter.
                        </p>
                        <p style="
                      line-height: 3;
                      margin: 2rem auto;
                      width: 50%;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">
                            GCF is all about making your dreams come true and at the same time
                            giving to a great cause. Through your donations from generous people
                            like you, we will deliver hope and love to the impoverished.
                        </p>
                        <p style="
                      line-height: 2;
                      margin: 2rem auto;
                      width: 50%;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">
                            We look forward to bringing you all the latest news, updates and
                            offers.
                        </p>
        
                        <p style="
                      line-height: 2;
                      margin: 2rem auto;
                      width: 50%;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">
                            Yours sincerely,
                        </p>
                        <p style="
                      line-height: 3;
                      margin-top: 1.9rem;
                      margin: 0.3rem auto;
                      width: 50%;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">
                            Team <strong>GARNET CARE</strong>
                        </p>
        
                        <a href="/" rel="noreferrer noopener" style="
                      text-decoration: none;
                      color: white;
                      display: block;
                      width: 100%;
                      text-align: center;
                      margin: auto;
                      padding: 1rem;
                      background-color: #694a98;
                      border-radius: 8.5px;
                      color: white;
                      font: bold 1.5rem 'Times new Roman', 'Times';
                      margin-top: 1.5rem;
                    ">Let's Touch Lives</a>
        
                        <div style="
                      width: 30%;
                      text-align: center;
                      margin: 2.5rem auto;
                      font: bold 1.5rem 'Times new Roman', 'Times';
                    ">
                            <p>Follow Us On Socials</p>
                        </div>
                        <div style="width: 50%; margin: auto">
                            <table style="width: 100%; margin-bottom: 0.5rem">
                                <tr>
                                    <th style="width: 10%">
                                        <a href="#" rel="noreferrer noopener"><img
                                                src="https://cdn.icon-icons.com/icons2/2119/PNG/512/google_icon_131222.png"
                                                style="width: 35px; height: 35px" /></a>
                                    </th>
                                    <th style="width: 10%">
                                        <a href="#" rel="noreferrer noopener"><img
                                                src="https://icons-for-free.com/iconfiles/png/512/color+facebook+icon-1320168272811213233.png"
                                                style="width: 35px; height: 35px" /></a>
                                    </th>
                                    <th style="width: 10%">
                                        <a href="#" rel="noreferrer noopener"><img
                                                src="https://image.freepik.com/free-vector/instagram-icon_1057-2227.jpg"
                                                style="width: 35px; height: 35px" /></a>
                                    </th>
                                    <th style="width: 10%">
                                        <a href="#" rel="noreferrer noopener"><img
                                                src="https://utilitypeopleuk.com/wp-content/uploads/2017/06/twitter-icon-circle-blue-logo-preview.png"
                                                style="width: 35px; height: 35px" /></a>
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div style="width: 45%; margin: auto; border-top :2px solid  #694a98 ;">
                            <p style="
                      line-height: 3;
                      margin: 1.5rem auto;
                      width: 100%;
                      text-align: center;
                      font: 500 1.2rem 'Times new Roman', 'Times';
                    ">If you have any questions or concerns, we are here to help you. <a href="#" rel="noreferrer noopener"
                                    style="text-decoration: none;">Contact Us</a></p>
                        </div>
        
                    </div>
                </div>
                </div>
            </main>
        </body>

            `
        })

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