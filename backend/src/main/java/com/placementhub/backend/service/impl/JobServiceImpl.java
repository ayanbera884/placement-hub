package com.placementhub.backend.service.impl;

import com.placementhub.backend.dto.JobDto;
import com.placementhub.backend.entity.Company;
import com.placementhub.backend.entity.EmploymentType;
import com.placementhub.backend.entity.Job;
import com.placementhub.backend.exception.ResourceNotFoundException;
import com.placementhub.backend.repository.CompanyRepository;
import com.placementhub.backend.repository.JobRepository;
import com.placementhub.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Override
    public JobDto createJob(JobDto jobDto) {
        Company company = companyRepository.findById(jobDto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", jobDto.getCompanyId()));

        Job job = mapToEntity(jobDto);
        job.setCompany(company);
        Job savedJob = jobRepository.save(job);
        
        return mapToDto(savedJob);
    }

    @Override
    public JobDto getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        return mapToDto(job);
    }

    @Override
    public Page<JobDto> searchJobs(String keyword, String location, String skill, EmploymentType employmentType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs = jobRepository.searchJobs(keyword, location, skill, employmentType, pageable);
        return jobs.map(this::mapToDto);
    }

    @Override
    public JobDto updateJob(Long jobId, JobDto jobDto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        Company company = companyRepository.findById(jobDto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", jobDto.getCompanyId()));

        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setRequiredSkills(jobDto.getRequiredSkills());
        job.setSalaryPackage(jobDto.getSalaryPackage());
        job.setLocation(jobDto.getLocation());
        job.setEmploymentType(jobDto.getEmploymentType());
        job.setExperienceRequirement(jobDto.getExperienceRequirement());
        job.setMinimumCgpa(jobDto.getMinimumCgpa());
        job.setApplicationDeadline(jobDto.getApplicationDeadline());
        job.setCompany(company);

        Job updatedJob = jobRepository.save(job);
        return mapToDto(updatedJob);
    }

    @Override
    public void deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        jobRepository.delete(job);
    }

    private Job mapToEntity(JobDto dto) {
        Job job = new Job();
        job.setId(dto.getId());
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequiredSkills(dto.getRequiredSkills());
        job.setSalaryPackage(dto.getSalaryPackage());
        job.setLocation(dto.getLocation());
        job.setEmploymentType(dto.getEmploymentType());
        job.setExperienceRequirement(dto.getExperienceRequirement());
        job.setMinimumCgpa(dto.getMinimumCgpa());
        job.setApplicationDeadline(dto.getApplicationDeadline());
        // Company mapping is handled in the create/update methods
        return job;
    }

    private JobDto mapToDto(Job entity) {
        JobDto dto = new JobDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setRequiredSkills(entity.getRequiredSkills());
        dto.setSalaryPackage(entity.getSalaryPackage());
        dto.setLocation(entity.getLocation());
        dto.setEmploymentType(entity.getEmploymentType());
        dto.setExperienceRequirement(entity.getExperienceRequirement());
        dto.setMinimumCgpa(entity.getMinimumCgpa());
        dto.setApplicationDeadline(entity.getApplicationDeadline());
        dto.setCreatedDate(entity.getCreatedDate());
        
        if (entity.getCompany() != null) {
            dto.setCompanyId(entity.getCompany().getId());
            dto.setCompanyName(entity.getCompany().getName());
        }
        
        return dto;
    }
}
