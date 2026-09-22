package com.placementhub.backend.dto;

import com.placementhub.backend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private LocalDateTime appliedDate;
    private ApplicationStatus status;
    private String coverNote;

    // Optional fields for easy display on the frontend without extra API calls
    private String studentName;
    private String jobTitle;
    private String companyName;
}
