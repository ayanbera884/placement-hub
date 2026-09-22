package com.placementhub.backend.service.impl;

import com.placementhub.backend.dto.StudentDto;
import com.placementhub.backend.entity.Student;
import com.placementhub.backend.exception.ResourceNotFoundException;
import com.placementhub.backend.repository.StudentRepository;
import com.placementhub.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        if (studentRepository.existsByEmail(studentDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Student student = mapToEntity(studentDto);
        Student savedStudent = studentRepository.save(student);
        return mapToDto(savedStudent);
    }

    @Override
    public StudentDto getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        return mapToDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto updateStudent(Long studentId, StudentDto studentDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        // Update fields
        student.setName(studentDto.getName());
        // I will fix lowercase typo in getter/setter logic via manual mapping
        student.setPhone(studentDto.getPhone());

        // Don't update email here usually, or handle uniqueness check if doing so

        student.setCollege(studentDto.getCollege());
        student.setDegree(studentDto.getDegree());
        student.setBranch(studentDto.getBranch());
        student.setGraduationYear(studentDto.getGraduationYear());
        student.setCgpa(studentDto.getCgpa());
        student.setSkills(studentDto.getSkills());
        student.setGithubUrl(studentDto.getGithubUrl());
        student.setLinkedinUrl(studentDto.getLinkedinUrl());
        student.setPortfolioUrl(studentDto.getPortfolioUrl());
        student.setBio(studentDto.getBio());

        Student updatedStudent = studentRepository.save(student);
        return mapToDto(updatedStudent);
    }

    @Override
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        studentRepository.delete(student);
    }

    // Mapper methods
    private Student mapToEntity(StudentDto dto) {
        Student student = new Student();
        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setCollege(dto.getCollege());
        student.setDegree(dto.getDegree());
        student.setBranch(dto.getBranch());
        student.setGraduationYear(dto.getGraduationYear());
        student.setCgpa(dto.getCgpa());
        student.setSkills(dto.getSkills());
        student.setGithubUrl(dto.getGithubUrl());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setPortfolioUrl(dto.getPortfolioUrl());
        student.setBio(dto.getBio());
        return student;
    }

    private StudentDto mapToDto(Student entity) {
        StudentDto dto = new StudentDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setCollege(entity.getCollege());
        dto.setDegree(entity.getDegree());
        dto.setBranch(entity.getBranch());
        dto.setGraduationYear(entity.getGraduationYear());
        dto.setCgpa(entity.getCgpa());
        dto.setSkills(entity.getSkills());
        dto.setGithubUrl(entity.getGithubUrl());
        dto.setLinkedinUrl(entity.getLinkedinUrl());
        dto.setPortfolioUrl(entity.getPortfolioUrl());
        dto.setBio(entity.getBio());
        return dto;
    }
}
