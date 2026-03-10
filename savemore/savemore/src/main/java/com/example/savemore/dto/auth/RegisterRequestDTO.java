package com.example.savemore.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO{

    @NotBlank
    private String username;

    @Email
    private String email;

    @Size(min=6)
    private String password;

}