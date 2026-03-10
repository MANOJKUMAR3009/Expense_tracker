package com.example.savemore.service;


import com.example.savemore.dto.dashboard.DashboardResponseDTO;
import com.example.savemore.dto.dashboard.DashboardSummaryDTO;
import com.example.savemore.dto.dashboard.MonthlyReportDTO;
import com.example.savemore.dto.dashboard.CategoryBreakdownDTO;

import java.util.List;

public interface DashboardService {

    DashboardSummaryDTO getSummary(String username);

    List<MonthlyReportDTO> getMonthlyOverview(String username);

    List<CategoryBreakdownDTO> getCategoryBreakdown(String username);

    DashboardResponseDTO getDashboard(String username);
}