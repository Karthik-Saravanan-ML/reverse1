package com.crm.memory.repository;
import com.crm.memory.entity.MemoryCardVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface MemoryCardVersionRepository extends JpaRepository<MemoryCardVersion, UUID> {
    List<MemoryCardVersion> findByCardIdOrderByVersionNumberDesc(UUID cardId);
    int countByCardId(UUID cardId);
}
