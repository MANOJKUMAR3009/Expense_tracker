package com.example.savemore.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.YearMonth;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Entity
@Table(name = "budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    private Double monthlyLimit;

    private YearMonth month; // example: 2026-03

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;



    /*@Converter(autoApply = true)
    public class YearMonthConverter implements AttributeConverter<YearMonth, String> {

        @Override
        public String convertToDatabaseColumn(YearMonth yearMonth) {
            return yearMonth != null ? yearMonth.toString() : null;
        }

        @Override
        public YearMonth convertToEntityAttribute(String dbData) {
            return dbData != null ? YearMonth.parse(dbData) : null;
        }
    }*/
}