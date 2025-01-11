import emailjs from '@emailjs/browser';
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Prepare the email template variables
        const templateParams = {
            to_email: email,
            username: username,
            otp: verifyCode,
        };

        // Send the email using EmailJS
        const response = await emailjs.send(
            'service_97368wp',  // Replace with your EmailJS service ID
            'template_5h9sq39',  // Replace with your EmailJS template ID
            templateParams,
            'sjhWYCaqHvchcm5EZ'   // Replace with your EmailJS public key
        );

        if (response.status === 200) {
            return {
                success: true,
                message: "Verification email sent successfully",
            };
        } else {
            throw new Error('Failed to send email');
        }
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}
