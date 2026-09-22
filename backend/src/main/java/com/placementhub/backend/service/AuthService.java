package com.placementhub.backend.service;

import com.placementhub.backend.dto.AuthResponseDto;
import com.placementhub.backend.dto.LoginDto;
import com.placementhub.backend.dto.RegisterDto;

public interface AuthService {
    AuthResponseDto login(LoginDto loginDto);
    String register(RegisterDto registerDto);
}
