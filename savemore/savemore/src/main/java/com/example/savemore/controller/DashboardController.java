package com.example.savemore.controller;


import com.example.savemore.dto.dashboard.*;
import com.example.savemore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard(Authentication authentication) {

        String username = authentication.getName();
        DashboardResponseDTO response = dashboardService.getDashboard(username);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(Authentication authentication) {

        String username = authentication.getName();
        DashboardSummaryDTO summary = dashboardService.getSummary(username);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/monthly-overview")
    public List<MonthlyReportDTO> getMonthlyOverview(Authentication authentication) {

        String username = authentication.getName();
        return dashboardService.getMonthlyOverview(username);
    }

    @GetMapping("/category-breakdown")
    public List<CategoryBreakdownDTO> getCategoryBreakdown(Authentication authentication) {

        String username = authentication.getName();
        return dashboardService.getCategoryBreakdown(username);
    }
}