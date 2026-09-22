package com.placementhub.backend.service.impl;

import com.placementhub.backend.dto.ResumeDto;
import com.placementhub.backend.entity.Resume;
import com.placementhub.backend.entity.Student;
import com.placementhub.backend.exception.ResourceNotFoundException;
import com.placementhub.backend.repository.ResumeRepository;
import com.placementhub.backend.repository.StudentRepository;
import com.placementhub.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final StudentRepository studentRepository;

    @Value("${file.upload-dir:uploads/resumes}")
    private String uploadDir;

    @Override
    public ResumeDto uploadResume(Long studentId, MultipartFile file) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new RuntimeException("Only PDF files are allowed.");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            // Use UUID to prevent filename collisions
            String uniqueFileName = "student_" + studentId + "_" + UUID.randomUUID() + ".pdf";
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // If student already has a resume, update it; else create new
            Resume resume = resumeRepository.findByStudentId(studentId)
                    .orElse(new Resume());

            // Delete old file if updating
            if (resume.getFilePath() != null) {
                Path oldPath = Paths.get(resume.getFilePath());
                Files.deleteIfExists(oldPath);
            }

            resume.setFileName(file.getOriginalFilename());
            resume.setFileType(contentType);
            resume.setFileSize(file.getSize());
            resume.setFilePath(filePath.toString());
            resume.setStudent(student);

            Resume savedResume = resumeRepository.save(resume);
            return mapToDto(savedResume);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload resume: " + e.getMessage());
        }
    }

    

    @Override
public ResumeDto getResumeByStudentId(Long studentId) {

    validateStudentAccess(studentId);

    Resume resume = resumeRepository.findByStudentId(studentId)
    
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "studentId", studentId));
        return mapToDto(resume);
    }

   
   @Override
public Resource downloadResume(Long studentId) {

    validateStudentAccess(studentId);

    Resume resume = resumeRepository.findByStudentId(studentId)
   
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "studentId", studentId));
        try {
            Path filePath = Paths.get(resume.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable.");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File path is malformed: " + e.getMessage());
        }
    }

    @Override
public void deleteResume(Long studentId) {

    validateStudentAccess(studentId);

    Resume resume = resumeRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "studentId", studentId));
        try {
            Path filePath = Paths.get(resume.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
        resumeRepository.delete(resume);
    }

private void validateStudentAccess(Long studentId) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
        throw new RuntimeException("Authentication required.");
    }

    String loggedInEmail = authentication.getName();

    Student student = studentRepository.findById(studentId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Student", "id", studentId));

    boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN"));

    if (!isAdmin && !student.getEmail().equalsIgnoreCase(loggedInEmail)) {
        throw new RuntimeException("You are not authorized to access this resume.");
    }
}



    private ResumeDto mapToDto(Resume entity) {
        ResumeDto dto = new ResumeDto();
        dto.setId(entity.getId());
        dto.setFileName(entity.getFileName());
        dto.setFileType(entity.getFileType());
        dto.setFileSize(entity.getFileSize());
        dto.setUploadedAt(entity.getUploadedAt());
        dto.setStudentId(entity.getStudent().getId());
        dto.setDownloadUrl("/api/resumes/student/" + entity.getStudent().getId() + "/download");
        return dto;
    }
}
