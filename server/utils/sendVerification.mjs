import nodemailer from "nodemailer";
import twilio from "twilio";

// Email Verification
export const sendVerificationCodeEmail = async (email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "Wyattbensman5@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "NEED THIS STILL",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "Wyattbensman5@gmail.com",
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error("Failed to send verification code via email.");
  }
};

// SMS Verification
export const sendVerificationCodeSMS = async (
  phoneNumber,
  verificationCode
) => {
  try {
    const accountSid =
      process.env.TWILIO_ACCOUNT_SID || "ACda24de8bffa094a457c58cc10e4ab72c";
    const authToken =
      process.env.TWILIO_AUTH_TOKEN || "8080bbec86969aa07e0ce640898b6fc9";
    const twilioPhoneNumber =
      process.env.TWILIO_PHONE_NUMBER || "(301) 450-6969";

    const client = new twilio(accountSid, authToken);

    await client.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      to: phoneNumber,
      from: twilioPhoneNumber,
    });
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
    throw new Error("Failed to send verification code via SMS.");
  }
};

// Function to generate a 5-digit random verification code
export const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
