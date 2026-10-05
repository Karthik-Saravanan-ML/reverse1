package com.crm.meetings.repository;

import com.crm.meetings.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MeetingRepository extends JpaRepository<Meeting, UUID> {
    List<Meeting> findByProjectIdOrderByScheduledStartAtDesc(UUID projectId);
    List<Meeting> findByProjectIdAndStatus(UUID projectId, String status);
}
