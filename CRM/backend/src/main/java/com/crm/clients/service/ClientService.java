package com.crm.clients.service;

import com.crm.clients.dto.CreateClientProfileRequest;
import com.crm.clients.entity.ClientProfile;
import com.crm.clients.entity.Organization;
import com.crm.clients.repository.ClientProfileRepository;
import com.crm.clients.repository.OrganizationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ClientService {
    
    private final OrganizationRepository orgRepo;
    private final ClientProfileRepository profileRepo;
    
    public ClientService(OrganizationRepository orgRepo, ClientProfileRepository profileRepo) {
        this.orgRepo = orgRepo;
        this.profileRepo = profileRepo;
    }
    
    public ClientProfile getClientProfile(UUID userId) {
        return profileRepo.findByUserId(userId).orElseThrow();
    }
    
    public ClientProfile updateClientProfile(UUID userId, CreateClientProfileRequest req) {
        ClientProfile p = getClientProfile(userId);
        p.setJobTitle(req.getJobTitle());
        p.setPrimary(req.isPrimary());
        return profileRepo.save(p);
    }
    
    public List<ClientProfile> getClientsByOrganization(UUID orgId) {
        return profileRepo.findByOrganizationId(orgId);
    }
    
    public Page<Organization> getOrganizations(Pageable p) {
        return orgRepo.findAll(p);
    }
    
    public Organization createOrganization(Organization org) {
        return orgRepo.save(org);
    }
}
