const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io", // Mailtrap configuration
    port: 2525,
    auth: {
        user: "b8e69d95d8836c",
        pass: "9175b2fe4ce449"
    }
});

// Function to send email
const sendEmail = async (userEmail, fullname, phone, message) => {
    try {
        // Email to user
        const userMailOptions = {
            from: 'info@mailtrap.club',
            to: userEmail,
            subject: 'Thank You for Your Message',
            text: `Dear ${fullname},\n\nThank you for your message. We will get back to you soon.\n\nYour message:\n${message}\n\nPhone number: ${phone}`
        };

        // Email to admin
        const adminMailOptions = {
            from: 'info@mailtrap.club',
            to: 'sheikh856591@gmail.com', // Replace with your email address
            subject: 'New Message from Contact Form',
            text: `New message from ${fullname} (${userEmail}):\n\nPhone: ${phone}\n\nMessage:\n${message}`
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(userMailOptions),
            transporter.sendMail(adminMailOptions)
        ]);

    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
