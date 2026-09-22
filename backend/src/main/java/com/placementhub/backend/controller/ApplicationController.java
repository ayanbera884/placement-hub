package com.placementhub.backend.controller;

import com.placementhub.backend.dto.ApplicationDto;
import com.placementhub.backend.entity.ApplicationStatus;
import com.placementhub.backend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // Apply for a job
    @PostMapping
    public ResponseEntity<ApplicationDto> applyForJob(@Valid @RequestBody ApplicationDto applicationDto) {
        return new ResponseEntity<>(applicationService.applyForJob(applicationDto), HttpStatus.CREATED);
    }

    // Get all applications (Admin use)
    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    // Get a specific application
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable("id") Long applicationId) {
        return ResponseEntity.ok(applicationService.getApplicationById(applicationId));
    }

    // Get all applications by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationDto>> getApplicationsByStudent(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    // Get all applications for a specific job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getApplicationsByJob(@PathVariable("jobId") Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    // Update application status (typically used by Admin or Company)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable("id") Long applicationId,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status));
    }

    // Withdraw application
    @DeleteMapping("/{id}")
    public ResponseEntity<String> withdrawApplication(@PathVariable("id") Long applicationId) {
        applicationService.withdrawApplication(applicationId);
        return ResponseEntity.ok("Application withdrawn successfully");
    }
}
