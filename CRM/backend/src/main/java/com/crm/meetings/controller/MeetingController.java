package com.crm.meetings.controller;

import com.crm.meetings.dto.CreateMeetingRequest;
import com.crm.meetings.dto.MeetingDto;
import com.crm.meetings.dto.MeetingNotesDto;
import com.crm.meetings.dto.SaveMeetingNotesRequest;
import com.crm.meetings.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/projects/{projectId}/meetings")
    public MeetingDto createMeeting(@PathVariable UUID projectId, @RequestBody CreateMeetingRequest req) {
        return meetingService.createMeeting(req, null); // user auth integration needed
    }

    @GetMapping("/projects/{projectId}/meetings")
    public List<MeetingDto> getMeetingsForProject(@PathVariable UUID projectId) {
        return meetingService.getMeetingsForProject(projectId, null);
    }

    @GetMapping("/projects/{projectId}/meetings/{meetingId}")
    public MeetingDto getMeetingById(@PathVariable UUID projectId, @PathVariable UUID meetingId) {
        return meetingService.getMeetingById(meetingId, null);
    }

    @GetMapping("/projects/{projectId}/meetings/{meetingId}/notes")
    public MeetingNotesDto getNotes(@PathVariable UUID projectId, @PathVariable UUID meetingId) {
        return meetingService.getNotes(meetingId, null);
    }

    @PutMapping("/projects/{projectId}/meetings/{meetingId}/notes")
    public MeetingNotesDto saveNotes(@PathVariable UUID projectId, @PathVariable UUID meetingId, @RequestBody SaveMeetingNotesRequest req) {
        return meetingService.saveNotes(meetingId, req, null);
    }

    @PostMapping("/projects/{projectId}/meetings/{meetingId}/submit-to-memory")
    public void submitNotesToMemory(@PathVariable UUID projectId, @PathVariable UUID meetingId) {
        meetingService.submitNotesToMemory(meetingId, null);
    }

    @PatchMapping("/projects/{projectId}/meetings/{meetingId}/status")
    public void updateMeetingStatus(@PathVariable UUID projectId, @PathVariable UUID meetingId, @RequestBody String status) {
        meetingService.updateMeetingStatus(meetingId, status, null);
    }
}
