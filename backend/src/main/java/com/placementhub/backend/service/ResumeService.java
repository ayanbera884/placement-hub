package com.placementhub.backend.service;

import com.placementhub.backend.dto.ResumeDto;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
    ResumeDto uploadResume(Long studentId, MultipartFile file);
    ResumeDto getResumeByStudentId(Long studentId);
    Resource downloadResume(Long studentId);
    void deleteResume(Long studentId);
}
