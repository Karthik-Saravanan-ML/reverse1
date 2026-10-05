import os

base_dir = r"C:\Users\Karthik\Downloads\CRM\backend\src\main\java\com\crm"

files = {
    "clients/entity/Organization.java": """
package com.crm.clients.entity;
import com.crm.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Data;
@Entity @Data public class Organization extends BaseEntity { private String name; private String industry; private String website; private String address; private String phone; private String email; }
""",
    "clients/entity/ClientProfile.java": """
package com.crm.clients.entity;
import com.crm.common.entity.BaseEntity;
import com.crm.auth.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity @Data public class ClientProfile extends BaseEntity { 
    @Column(name="user_id") private UUID userId;
    @Column(name="organization_id") private UUID organizationId;
    private String jobTitle; private boolean isPrimary; 
    @OneToOne @JoinColumn(name="user_id", insertable=false, updatable=false) private User user;
    @ManyToOne @JoinColumn(name="organization_id", insertable=false, updatable=false) private Organization organization;
}
""",
    "clients/repository/OrganizationRepository.java": """
package com.crm.clients.repository;
import com.crm.clients.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    List<Organization> findByName(String name);
    List<Organization> findByIndustry(String industry);
}
""",
    "clients/repository/ClientProfileRepository.java": """
package com.crm.clients.repository;
import com.crm.clients.entity.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface ClientProfileRepository extends JpaRepository<ClientProfile, UUID> {
    Optional<ClientProfile> findByUserId(UUID userId);
    List<ClientProfile> findByOrganizationId(UUID organizationId);
}
""",
    "clients/dto/ClientProfileDto.java": "package com.crm.clients.dto; import lombok.Data; import java.util.UUID; @Data public class ClientProfileDto { private UUID id; private UUID userId; private UUID organizationId; private String jobTitle; private boolean isPrimary; }",
    "clients/dto/CreateClientProfileRequest.java": "package com.crm.clients.dto; import lombok.Data; import java.util.UUID; @Data public class CreateClientProfileRequest { private UUID userId; private UUID organizationId; private String jobTitle; private boolean isPrimary; }",
    "clients/service/ClientService.java": """
package com.crm.clients.service;
import com.crm.clients.entity.*;
import com.crm.clients.repository.*;
import com.crm.clients.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.*;
@Service
public class ClientService {
    private final OrganizationRepository orgRepo;
    private final ClientProfileRepository profileRepo;
    public ClientService(OrganizationRepository orgRepo, ClientProfileRepository profileRepo) { this.orgRepo = orgRepo; this.profileRepo = profileRepo; }
    public ClientProfile getClientProfile(UUID userId) { return profileRepo.findByUserId(userId).orElseThrow(); }
    public ClientProfile updateClientProfile(UUID userId, CreateClientProfileRequest req) { ClientProfile p = getClientProfile(userId); p.setJobTitle(req.getJobTitle()); p.setPrimary(req.isPrimary()); return profileRepo.save(p); }
    public List<ClientProfile> getClientsByOrganization(UUID orgId) { return profileRepo.findByOrganizationId(orgId); }
    public Page<Organization> getOrganizations(Pageable p) { return orgRepo.findAll(p); }
    public Organization createOrganization(Organization org) { return orgRepo.save(org); }
}
""",
    "clients/controller/ClientController.java": """
package com.crm.clients.controller;
import com.crm.clients.service.ClientService;
import com.crm.clients.entity.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.*;
@RestController @RequestMapping("/api/clients")
public class ClientController {
    private final ClientService service;
    public ClientController(ClientService service) { this.service = service; }
    @GetMapping("/{id}") public ClientProfile getProfile(@PathVariable UUID id) { return service.getClientProfile(id); }
    @GetMapping("/organizations") public Page<Organization> getOrgs(Pageable p) { return service.getOrganizations(p); }
    @GetMapping("/organizations/{id}/clients") public List<ClientProfile> getOrgClients(@PathVariable UUID id) { return service.getClientsByOrganization(id); }
}
""",
    "projects/entity/Project.java": """
package com.crm.projects.entity;
import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.ProjectStatus;
import com.crm.common.enums.Priority;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
@Entity @Data public class Project extends BaseEntity {
    private String title; private String description; private String type;
    @Enumerated(EnumType.STRING) private ProjectStatus status;
    private UUID managerId; private UUID organizationId;
    private ZonedDateTime startDate; private ZonedDateTime endDate; private ZonedDateTime targetDate;
    private BigDecimal budget; @Enumerated(EnumType.STRING) private Priority priority;
    private Integer progressPercentage; private boolean isActive;
    private UUID createdBy; private UUID updatedBy;
}
""",
    "projects/entity/ProjectMembership.java": """
package com.crm.projects.entity;
import com.crm.common.entity.BaseEntity;
import com.crm.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.ZonedDateTime;
@Entity @Data 
@Table(uniqueConstraints = @UniqueConstraint(columnNames={"projectId", "userId"}))
public class ProjectMembership extends BaseEntity {
    private UUID projectId; private UUID userId;
    @Enumerated(EnumType.STRING) private UserRole memberRole;
    private boolean isActive; private boolean isTeamLead;
    private ZonedDateTime joinedAt; private ZonedDateTime removedAt;
    private UUID removedBy; private String removalReason;
}
""",
    "projects/repository/ProjectRepository.java": """
package com.crm.projects.repository;
import com.crm.projects.entity.Project;
import com.crm.common.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Page<Project> findByManagerId(UUID managerId, Pageable pageable);
    Page<Project> findByOrganizationId(UUID orgId, Pageable pageable);
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    @Query("SELECT p FROM Project p JOIN ProjectMembership pm ON p.id = pm.projectId WHERE pm.userId = :userId AND pm.isActive = true")
    Page<Project> findByMemberUserId(UUID userId, Pageable pageable);
}
""",
    "projects/repository/ProjectMembershipRepository.java": """
package com.crm.projects.repository;
import com.crm.projects.entity.ProjectMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, UUID> {
    List<ProjectMembership> findByProjectIdAndIsActiveTrue(UUID projectId);
    List<ProjectMembership> findByUserIdAndIsActiveTrue(UUID userId);
    Optional<ProjectMembership> findByProjectIdAndUserIdAndIsActiveTrue(UUID projectId, UUID userId);
    long countByUserIdAndIsActiveTrue(UUID userId);
    boolean existsByProjectIdAndUserIdAndIsActiveTrue(UUID projectId, UUID userId);
}
""",
    "projects/service/ProjectService.java": """
package com.crm.projects.service;
import com.crm.projects.entity.*;
import com.crm.projects.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Service @Transactional
public class ProjectService {
    private final ProjectRepository projRepo;
    private final ProjectMembershipRepository memRepo;
    public ProjectService(ProjectRepository p, ProjectMembershipRepository m) { projRepo = p; memRepo = m; }
    public Project getProject(UUID id, UUID reqUser) { return projRepo.findById(id).orElseThrow(); }
    public Page<Project> getProjectsForUser(UUID userId, Pageable p) { return projRepo.findByMemberUserId(userId, p); }
    public Project createProject(Project p, UUID creatorId) { p.setCreatedBy(creatorId); return projRepo.save(p); }
    
    public ProjectMembership addTeamMember(UUID projId, UUID userId, UUID addedBy, com.crm.common.enums.UserRole role) {
        if(memRepo.countByUserIdAndIsActiveTrue(userId) >= 3) throw new RuntimeException("BusinessRuleException: Max 3 active projects allowed.");
        ProjectMembership pm = new ProjectMembership();
        pm.setProjectId(projId); pm.setUserId(userId); pm.setMemberRole(role); pm.setActive(true); pm.setJoinedAt(java.time.ZonedDateTime.now());
        return memRepo.save(pm);
    }
}
""",
    "projects/controller/ProjectController.java": """
package com.crm.projects.controller;
import com.crm.projects.service.ProjectService;
import com.crm.projects.entity.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@RestController @RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService service;
    public ProjectController(ProjectService service) { this.service = service; }
    @GetMapping public Page<Project> getUserProjects(@RequestParam UUID userId, Pageable p) { return service.getProjectsForUser(userId, p); }
    @PostMapping public Project createProject(@RequestBody Project p, @RequestParam UUID creatorId) { return service.createProject(p, creatorId); }
    @PostMapping("/{id}/team") public ProjectMembership addMember(@PathVariable UUID id, @RequestParam UUID userId, @RequestParam UUID addedBy) { return service.addTeamMember(id, userId, addedBy, com.crm.common.enums.UserRole.EMPLOYEE); }
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
print("Part 1 generated")
