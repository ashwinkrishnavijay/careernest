package com.careernest.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioSmsService {

    private static final Logger log = LoggerFactory.getLogger(TwilioSmsService.class);

    @Value("${app.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.twilio.auth-token:}")
    private String authToken;

    @Value("${app.twilio.phone-number:}")
    private String fromPhoneNumber;

    @Value("${app.twilio.enabled:false}")
    private boolean enabled;

    private boolean initialized = false;

    @PostConstruct
    public void init() {
        if (enabled && accountSid != null && !accountSid.isBlank() && authToken != null && !authToken.isBlank()) {
            try {
                Twilio.init(accountSid, authToken);
                initialized = true;
                log.info("Twilio SMS Service successfully initialized with Account SID: {}", accountSid);
            } catch (Exception e) {
                log.error("Failed to initialize Twilio: {}", e.getMessage());
            }
        } else {
            log.info("Twilio SMS Service running in simulation/mock mode. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_ENABLED=true for live SMS.");
        }
    }

    public boolean sendSms(String toPhoneNumber, String messageBody) {
        if (toPhoneNumber == null || toPhoneNumber.isBlank()) {
            log.warn("Cannot send SMS: recipient phone number is empty");
            return false;
        }

        if (initialized && enabled) {
            try {
                Message message = Message.creator(
                        new PhoneNumber(toPhoneNumber),
                        new PhoneNumber(fromPhoneNumber),
                        messageBody
                ).create();
                log.info("Live Twilio SMS sent to {} - SID: {}", toPhoneNumber, message.getSid());
                return true;
            } catch (Exception e) {
                log.error("Error sending Twilio SMS to {}: {}", toPhoneNumber, e.getMessage());
                return false;
            }
        } else {
            // Simulated / Mock SMS mode for local development and demonstration
            log.info("[SMS NOTIFICATION SIMULATED]");
            log.info(" -> TO: {}", toPhoneNumber);
            log.info(" -> FROM: {}", (fromPhoneNumber != null && !fromPhoneNumber.isBlank()) ? fromPhoneNumber : "CareerNest");
            log.info(" -> MESSAGE: {}", messageBody);
            return true;
        }
    }

    public void sendRegistrationConfirmation(String phone, String name, String role) {
        String msg = String.format("Welcome to CareerNest, %s! Your %s account has been successfully registered. Discover endless opportunities!",
                name, role.replace("_", " "));
        sendSms(phone, msg);
    }

    public void sendApplicationSubmittedSeeker(String phone, String seekerName, String jobTitle, String company) {
        String msg = String.format("Hi %s, your application for '%s' at %s has been submitted successfully on CareerNest!",
                seekerName, jobTitle, company);
        sendSms(phone, msg);
    }

    public void sendApplicationReceivedEmployer(String phone, String employerName, String jobTitle, String seekerName) {
        String msg = String.format("Hello %s, you received a new application for '%s' from %s on CareerNest. Review it on your dashboard.",
                employerName, jobTitle, seekerName);
        sendSms(phone, msg);
    }

    public void sendApplicationStatusUpdate(String phone, String seekerName, String jobTitle, String company, String newStatus, String notes) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Hi %s, your application status for '%s' at %s has been updated to: %s.",
                seekerName, jobTitle, company, newStatus));
        if (notes != null && !notes.isBlank()) {
            sb.append(" Note: ").append(notes);
        }
        sendSms(phone, sb.toString());
    }

    public void sendJobPostingAlert(String phone, String employerName, String jobTitle) {
        String msg = String.format("CareerNest: '%s' has been successfully published by %s and is now visible to active job seekers!",
                jobTitle, employerName);
        sendSms(phone, msg);
    }
}
