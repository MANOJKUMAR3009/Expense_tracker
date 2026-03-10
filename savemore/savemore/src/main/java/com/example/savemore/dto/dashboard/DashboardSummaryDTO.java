package com.example.savemore.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummaryDTO {

    private Double totalIncome;
    private Double totalExpense;
    private Double totalBalance;
}