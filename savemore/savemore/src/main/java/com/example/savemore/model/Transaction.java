package com.example.savemore.model;

import com.example.savemore.model.enums.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Transaction{

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Positive
    private Double amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private LocalDate date;

    @Size(max=225)
    private String description;

    @ManyToOne
    private Category category;

    @ManyToOne
    private User user;
}