package com.example.savemore.dto.dashboard;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    private DashboardSummaryDTO summary;
    private List<MonthlyReportDTO> monthlyOverview;
    private List<CategoryBreakdownDTO> categoryBreakdown;
}
