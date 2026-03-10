package com.example.savemore.service;
import com.example.savemore.dto.auth.*;

public interface AuthService{
    AuthResponseDTO register(RegisterRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
}