package com.crm.auth.repository;

import com.crm.auth.entity.Invitation;
import com.crm.common.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    Optional<Invitation> findByTokenAndStatus(String token, InvitationStatus status);
    Optional<Invitation> findByEmailAndStatus(String email, InvitationStatus status);
}
