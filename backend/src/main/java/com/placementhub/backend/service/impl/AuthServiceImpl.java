package com.placementhub.backend.service.impl;

import com.placementhub.backend.dto.AuthResponseDto;
import com.placementhub.backend.dto.LoginDto;
import com.placementhub.backend.dto.RegisterDto;
import com.placementhub.backend.entity.Role;
import com.placementhub.backend.entity.Student;
import com.placementhub.backend.entity.User;
import com.placementhub.backend.repository.StudentRepository;
import com.placementhub.backend.repository.UserRepository;
import com.placementhub.backend.security.JwtTokenProvider;
import com.placementhub.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponseDto login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginDto.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponseDto response = new AuthResponseDto();
        response.setAccessToken(token);
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        
        if (user.getRole() == Role.ROLE_STUDENT) {
            // Find student profile linked to this user
            studentRepository.findByEmail(user.getEmail()).ifPresent(s -> response.setStudentId(s.getId()));
        }

        return response;
    }

    @Override
    @Transactional
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        // Create User (Auth credentials)
        User user = new User();
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(Role.ROLE_STUDENT); // Default to student for public registration
        userRepository.save(user);
        
        // Auto-create basic Student profile
        Student student = new Student();
        student.setName(registerDto.getName());
        student.setEmail(registerDto.getEmail());
        student.setPhone(registerDto.getPhone());
        studentRepository.save(student);

        return "User registered successfully.";
    }
}
