package com.crm.auth.service;

import com.crm.auth.entity.RegistrationRequest;
import com.crm.auth.entity.User;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {
    public void sendRegistrationPendingEmail(RegistrationRequest request) {
        log.info("Sending registration pending email to {}", request.getEmail());
    }

    public void sendApprovalEmail(String email, String invitationToken) {
        log.info("Sending approval email to {} with token {}", email, invitationToken);
    }

    public void sendRejectionEmail(String email, String reason) {
        log.info("Sending rejection email to {} for reason {}", email, reason);
    }

    public void sendPasswordResetEmail(String email, String resetToken) {
        log.info("Sending password reset email to {} with token {}", email, resetToken);
    }

    public void sendWelcomeEmail(User user) {
        log.info("Sending welcome email to {}", user.getEmail());
    }
}
