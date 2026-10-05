package com.crm.clients.controller;

import com.crm.clients.entity.ClientProfile;
import com.crm.clients.entity.Organization;
import com.crm.clients.service.ClientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    
    private final ClientService service;
    
    public ClientController(ClientService service) {
        this.service = service;
    }
    
    @GetMapping("/{id}")
    public ClientProfile getProfile(@PathVariable UUID id) {
        return service.getClientProfile(id);
    }
    
    @GetMapping("/organizations")
    public Page<Organization> getOrgs(Pageable p) {
        return service.getOrganizations(p);
    }
    
    @GetMapping("/organizations/{id}/clients")
    public List<ClientProfile> getOrgClients(@PathVariable UUID id) {
        return service.getClientsByOrganization(id);
    }
}
