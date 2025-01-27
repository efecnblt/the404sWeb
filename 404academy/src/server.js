const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "Gmail", // Gmail veya SMTP sağlayıcınızı belirtin
    auth: {
        user: "academy404s@gmail.com", // Gönderen e-mail adresi
        pass: "27s38dbSLNX", // Gönderen e-mail şifresi (ya da uygulama şifresi)
    },
});

// Subscribe Endpoint
app.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Kullanıcıya e-mail gönderme
        await transporter.sendMail({
            from: "academy404s@gmail.com",
            to: email,
            subject: "Subscription Confirmation",
            text: `Thank you for subscribing!`,
            html: `<h1>Welcome!</h1><p>Thank you for subscribing to our service.</p>`,
        });

        res.status(200).json({ message: "Subscription email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

// Sunucuyu başlatma
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
