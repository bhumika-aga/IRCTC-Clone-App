package com.nextgenrail.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Email service for sending notifications
 * Currently implements OTP email functionality
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@nextgenrail.com}")
    private String fromEmail;

    @Value("${app.name}")
    private String appName;

    /**
     * Send OTP email to user
     */
    public void sendOtpEmail(String toEmail, String otp, String firstName) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(appName + " - Login OTP");

                String body = buildOtpEmailBody(firstName, otp);
                message.setText(body);

                mailSender.send(message);
                logger.info("OTP email sent successfully to: {}", toEmail);
            } else {
                // Development mode - just log the OTP
                logger.info("DEVELOPMENT MODE - OTP for {}: {}", toEmail, otp);
                logger.info("Email content would be: {}", buildOtpEmailBody(firstName, otp));
            }

        } catch (Exception e) {
            logger.error("Failed to send OTP email to: {}, error: {}", toEmail, e.getMessage());
            // In development, don't fail on email errors
            if (mailSender != null) {
                throw new RuntimeException("Failed to send OTP email", e);
            }
        }
    }

    /**
     * Send booking confirmation email
     */
    public void sendBookingConfirmationEmail(String toEmail, String pnrNumber,
            String trainName, String journeyDetails) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(appName + " - Booking Confirmed - PNR: " + pnrNumber);

                String body = buildBookingConfirmationBody(pnrNumber, trainName, journeyDetails);
                message.setText(body);

                mailSender.send(message);
                logger.info("Booking confirmation email sent successfully to: {}", toEmail);
            } else {
                logger.info("DEVELOPMENT MODE - Booking confirmation for PNR {} sent to {}", pnrNumber, toEmail);
            }

        } catch (Exception e) {
            logger.error("Failed to send booking confirmation email to: {}, error: {}",
                    toEmail, e.getMessage());
        }
    }

    /**
     * Send booking cancellation email
     */
    public void sendBookingCancellationEmail(String toEmail, String pnrNumber,
            double refundAmount) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(appName + " - Booking Cancelled - PNR: " + pnrNumber);

                String body = buildBookingCancellationBody(pnrNumber, refundAmount);
                message.setText(body);

                mailSender.send(message);
                logger.info("Booking cancellation email sent successfully to: {}", toEmail);
            } else {
                logger.info("DEVELOPMENT MODE - Cancellation confirmation for PNR {} sent to {}", pnrNumber, toEmail);
            }

        } catch (Exception e) {
            logger.error("Failed to send booking cancellation email to: {}, error: {}",
                    toEmail, e.getMessage());
        }
    }

    /**
     * Build OTP email body
     */
    private String buildOtpEmailBody(String firstName, String otp) {
        return String.format("""
                Dear %s,

                Welcome to %s!

                Your One-Time Password (OTP) for login is: %s

                This OTP is valid for 5 minutes only. Please do not share this OTP with anyone.

                If you did not request this OTP, please ignore this email.

                Happy Journey!
                Team %s

                ---
                This is an automated email. Please do not reply to this email.
                """, firstName, appName, otp, appName);
    }

    /**
     * Build booking confirmation email body
     */
    private String buildBookingConfirmationBody(String pnrNumber, String trainName,
            String journeyDetails) {
        return String.format("""
                Dear Passenger,

                Your train booking has been confirmed successfully!

                Booking Details:
                PNR Number: %s
                Train: %s
                Journey: %s

                Please save this PNR number for future reference and carry a valid photo ID during travel.

                You can check your PNR status anytime on our website or app.

                Happy Journey!
                Team %s

                ---
                This is an automated email. Please do not reply to this email.
                """, pnrNumber, trainName, journeyDetails, appName);
    }

    /**
     * Build booking cancellation email body
     */
    private String buildBookingCancellationBody(String pnrNumber, double refundAmount) {
        return String.format("""
                Dear Passenger,

                Your train booking has been cancelled successfully.

                Cancellation Details:
                PNR Number: %s
                Refund Amount: ₹%.2f

                The refund amount will be credited to your original payment method within 7-10 working days.

                Thank you for using our service.
                Team %s

                ---
                This is an automated email. Please do not reply to this email.
                """, pnrNumber, refundAmount, appName);
    }
}