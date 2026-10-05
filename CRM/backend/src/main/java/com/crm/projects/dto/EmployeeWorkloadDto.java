package com.crm.projects.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class EmployeeWorkloadDto {
    private UUID employeeId;
    private String name;
    private long activeProjectCount;
    private List<ProjectDto> projects;
}
