package com.placementhub.backend.service;

import com.placementhub.backend.dto.ApplicationDto;
import com.placementhub.backend.entity.ApplicationStatus;

import java.util.List;

public interface ApplicationService {
    ApplicationDto applyForJob(ApplicationDto applicationDto);
    List<ApplicationDto> getAllApplications();
    List<ApplicationDto> getApplicationsByStudent(Long studentId);
    List<ApplicationDto> getApplicationsByJob(Long jobId);
    ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus status);
    void withdrawApplication(Long applicationId);
    ApplicationDto getApplicationById(Long applicationId);
}
