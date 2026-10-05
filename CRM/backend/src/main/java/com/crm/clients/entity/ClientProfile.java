package com.crm.clients.entity;

import com.crm.auth.entity.User;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class ClientProfile extends BaseEntity {
    
    @Column(name = "user_id")
    private UUID userId;
    
    @Column(name = "organization_id")
    private UUID organizationId;
    
    private String jobTitle;
    private boolean isPrimary;
    
    @OneToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "organization_id", insertable = false, updatable = false)
    private Organization organization;
}
