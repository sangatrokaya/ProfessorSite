import nodemailer from "nodemailer";

// @desc Send contact message email
// @route POST /api/contact
// @aceess Public
export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Avoids port/host confusion
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Processor Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      replyTo: email,
      subject: "New Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong>${name}</p>
        <p><strong>Email:</strong>${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email send error: ", error);
    res.status(500).json({ message: "Failed to send message!" });
  }
};
