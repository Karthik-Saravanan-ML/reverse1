package com.crm.clients.entity;

import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Organization extends BaseEntity {
    private String name;
    private String industry;
    private String website;
    private String address;
    private String phone;
    private String email;
}
