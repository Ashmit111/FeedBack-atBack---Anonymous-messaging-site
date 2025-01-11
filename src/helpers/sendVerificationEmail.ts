import emailjs from '@emailjs/browser';
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    if (typeof window === "undefined") {
        return {
            success: false,
            message: "Email sending is only supported on the client-side.",
        };
    }

    try {
        const templateParams = {
            to_email: email,
            username: username,
            otp: verifyCode,
        };

        // Send the email using EmailJS with provided service, template, and public key
        const response = await emailjs.send(
            'service_97368wp',  // EmailJS service ID
            'template_5h9sq39',  // EmailJS template ID
            templateParams,
            'sjhWYCaqHvchcm5EZ'   // EmailJS public key
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
