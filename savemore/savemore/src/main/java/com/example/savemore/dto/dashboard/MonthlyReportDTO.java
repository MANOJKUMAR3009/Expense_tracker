package com.example.savemore.dto.dashboard;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyReportDTO {

    private Integer month;
    private Double totalIncome;
    private Double totalExpense;
}