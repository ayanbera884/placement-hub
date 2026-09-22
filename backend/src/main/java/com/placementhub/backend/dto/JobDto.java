package com.placementhub.backend.dto;

import com.placementhub.backend.entity.EmploymentType;
import jakarta.validation.constraints.NotBlank;
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
public class JobDto {
    private Long id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requiredSkills;
    private String salaryPackage;
    private String location;

    private EmploymentType employmentType;

    private String experienceRequirement;
    private Double minimumCgpa;

    private LocalDateTime applicationDeadline;
    private LocalDateTime createdDate;

    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    // Optional: Include basic company info for frontend display without fetching company separately
    private String companyName;
}
