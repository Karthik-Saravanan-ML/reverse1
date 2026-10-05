package com.crm.auth.repository;

import com.crm.auth.entity.User;
import com.crm.common.enums.UserRole;
import com.crm.common.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    Page<User> findByRole(UserRole role, Pageable pageable);
    long countByStatusAndRole(UserStatus status, UserRole role);
    boolean existsByEmail(String email);
}
