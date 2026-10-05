package com.crm.auth.entity;

import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.RequestStatus;
import com.crm.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "registration_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private UserRole requestType;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private String name;
    private String email;
    private String phone;

    private String organizationName;
    private String department;
    private String jobTitle;
    private String position;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String requestReason;

    private String experienceLevel;
    private String joiningDate;
    private String industry;
    private String website;
    private String address;

    @Column(columnDefinition = "TEXT")
    private String projectRequirement;

    private UUID reviewedBy;
    private ZonedDateTime reviewedAt;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
