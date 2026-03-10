package com.example.savemore.dto.transaction;

import com.example.savemore.model.enums.TransactionType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
   private Long id;
    @Positive
    @NotNull
    private Double amount;

    @NotNull
    private TransactionType type;

    @NotNull
    private LocalDate date;

    @Size(max = 255)
    private String description;

    @NotNull
    private Long categoryId;

    private String categoryName;
}