package com.placementhub.backend.service.impl;

import com.placementhub.backend.dto.ApplicationDto;
import com.placementhub.backend.entity.Application;
import com.placementhub.backend.entity.ApplicationStatus;
import com.placementhub.backend.entity.Job;
import com.placementhub.backend.entity.Student;
import com.placementhub.backend.exception.DuplicateApplicationException;
import com.placementhub.backend.exception.ResourceNotFoundException;
import com.placementhub.backend.repository.ApplicationRepository;
import com.placementhub.backend.repository.JobRepository;
import com.placementhub.backend.repository.StudentRepository;
import com.placementhub.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    @Override
    public ApplicationDto applyForJob(ApplicationDto applicationDto) {
        // Prevent duplicate applications
        if (applicationRepository.existsByStudentIdAndJobId(applicationDto.getStudentId(), applicationDto.getJobId())) {
            throw new DuplicateApplicationException("Student has already applied for this job.");
        }

        Student student = studentRepository.findById(applicationDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", applicationDto.getStudentId()));

        Job job = jobRepository.findById(applicationDto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", applicationDto.getJobId()));

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setCoverNote(applicationDto.getCoverNote());

        Application savedApplication = applicationRepository.save(application);
        return mapToDto(savedApplication);
    }

    @Override
    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getApplicationsByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getApplicationsByJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "id", jobId);
        }
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        return mapToDto(updatedApplication);
    }

    @Override
    public void withdrawApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        
        // In a real system, you might only allow withdrawal if status is APPLIED, 
        // but for now we'll just set the status to WITHDRAWN
        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    @Override
    public ApplicationDto getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToDto(application);
    }

    private ApplicationDto mapToDto(Application entity) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(entity.getId());
        dto.setStudentId(entity.getStudent().getId());
        dto.setJobId(entity.getJob().getId());
        dto.setAppliedDate(entity.getAppliedDate());
        dto.setStatus(entity.getStatus());
        dto.setCoverNote(entity.getCoverNote());
        
        // Include display fields
        dto.setStudentName(entity.getStudent().getName());
        dto.setJobTitle(entity.getJob().getTitle());
        dto.setCompanyName(entity.getJob().getCompany().getName());
        
        return dto;
    }
}
