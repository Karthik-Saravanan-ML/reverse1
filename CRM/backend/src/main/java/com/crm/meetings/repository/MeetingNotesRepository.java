package com.crm.meetings.repository;

import com.crm.meetings.entity.MeetingNotes;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface MeetingNotesRepository extends JpaRepository<MeetingNotes, UUID> {
    Optional<MeetingNotes> findByMeetingId(UUID meetingId);
}
