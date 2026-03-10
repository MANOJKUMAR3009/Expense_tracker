package com.example.savemore.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.YearMonth;

@Data
@AllArgsConstructor
public class BudgetStatusDTO {

    private String category;
    private Double spent;
    private Double remaining;
    private Double percentageUsed;
    private Double monthlyLimit;
    private YearMonth month;
}