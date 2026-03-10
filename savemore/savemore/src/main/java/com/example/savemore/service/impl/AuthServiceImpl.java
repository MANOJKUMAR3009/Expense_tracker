package com.example.savemore.service.impl;


import com.example.savemore.dto.auth.AuthResponseDTO;
import com.example.savemore.dto.auth.LoginRequestDTO;
import com.example.savemore.dto.auth.RegisterRequestDTO;
import com.example.savemore.model.User;
import com.example.savemore.repository.UserRepository;
import com.example.savemore.security.JwtUtil;
import com.example.savemore.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
 private final UserRepository userRepository;
 private final PasswordEncoder passwordEncoder;
 private final JwtUtil jwtUtil;
 @Override
    public AuthResponseDTO register(RegisterRequestDTO request){
     if(userRepository.findByUsername(request.getUsername()).isPresent()){
         throw new RuntimeException("Username already exists");
     }
     if(userRepository.findByEmail(request.getEmail()).isPresent()){
         throw new RuntimeException("email already exists");
     }
     User user = User.builder()
             .username(request.getUsername())
             .email(request.getEmail())
             .password(passwordEncoder.encode(request.getPassword()))
             .createdAt(LocalDateTime.now())
             .build();

     userRepository.save(user);
     String token = jwtUtil.generateToken(user.getUsername());
     return new AuthResponseDTO(token, user.getUsername());
 }
    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponseDTO(token, user.getUsername());
    }
}
