package com.crm.auth.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.InvitationStatus;
import com.crm.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "invitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invitation extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    private UUID registrationRequestId;
    private UUID invitedBy;
    private ZonedDateTime expiresAt;
    private ZonedDateTime acceptedAt;
}
