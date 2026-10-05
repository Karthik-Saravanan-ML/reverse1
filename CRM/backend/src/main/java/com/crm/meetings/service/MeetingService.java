package com.crm.meetings.service;

import com.crm.meetings.dto.CreateMeetingRequest;
import com.crm.meetings.dto.MeetingDto;
import com.crm.meetings.dto.MeetingNotesDto;
import com.crm.meetings.dto.SaveMeetingNotesRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MeetingService {

    public MeetingDto createMeeting(CreateMeetingRequest req, UUID creatorId) {
        return null; // TODO: Implement createMeeting
    }

    public List<MeetingDto> getMeetingsForProject(UUID projectId, UUID requesterId) {
        return List.of(); // TODO: Implement getMeetingsForProject
    }

    public MeetingDto getMeetingById(UUID meetingId, UUID requesterId) {
        return null; // TODO: Implement getMeetingById
    }

    public MeetingNotesDto saveNotes(UUID meetingId, SaveMeetingNotesRequest req, UUID userId) {
        return null; // TODO: Implement saveNotes
    }

    public MeetingNotesDto getNotes(UUID meetingId, UUID requesterId) {
        return null; // TODO: Implement getNotes
    }

    public void submitNotesToMemory(UUID meetingId, UUID userId) {
        // TODO: Implement submitNotesToMemory
    }

    public void updateMeetingStatus(UUID meetingId, String status, UUID userId) {
        // TODO: Implement updateMeetingStatus
    }
}
