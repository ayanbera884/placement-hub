package com.placementhub.backend.dto;

import com.placementhub.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String accessToken;
    private String tokenType = "Bearer ";
    private String email;
    private Role role;
    private Long studentId; // Will be populated if role is STUDENT
}
