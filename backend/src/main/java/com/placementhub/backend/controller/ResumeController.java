package com.placementhub.backend.controller;

import com.placementhub.backend.dto.ResumeDto;
import com.placementhub.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // Upload or replace resume for a student
    @PostMapping("/student/{studentId}")
    public ResponseEntity<ResumeDto> uploadResume(
            @PathVariable Long studentId,
            @RequestParam("file") MultipartFile file) {
        ResumeDto dto = resumeService.uploadResume(studentId, file);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    // Get resume metadata for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ResumeDto> getResume(@PathVariable Long studentId) {
        return ResponseEntity.ok(resumeService.getResumeByStudentId(studentId));
    }

    // Download the actual PDF file
    @GetMapping("/student/{studentId}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long studentId) {
        Resource resource = resumeService.downloadResume(studentId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // Delete resume
    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<String> deleteResume(@PathVariable Long studentId) {
        resumeService.deleteResume(studentId);
        return ResponseEntity.ok("Resume deleted successfully.");
    }
}
