package com.placementhub.backend.service;

import com.placementhub.backend.dto.JobDto;
import com.placementhub.backend.entity.EmploymentType;
import org.springframework.data.domain.Page;

public interface JobService {
    JobDto createJob(JobDto jobDto);
    JobDto getJobById(Long jobId);
    Page<JobDto> searchJobs(String keyword, String location, String skill, EmploymentType employmentType, int page, int size);
    JobDto updateJob(Long jobId, JobDto jobDto);
    void deleteJob(Long jobId);
}
