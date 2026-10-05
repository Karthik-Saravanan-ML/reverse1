package com.crm.memory.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="memory_card_relations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoryCardRelation {
    @Id
    @GeneratedValue
    private UUID id;
    
    private UUID sourceCardId;
    private UUID targetCardId;
    private String relationType;
    private UUID createdBy;
    private Instant createdAt;
}
