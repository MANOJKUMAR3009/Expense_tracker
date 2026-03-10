package com.example.savemore.controller;

import com.example.savemore.dto.dashboard.BudgetStatusDTO;
import com.example.savemore.service.BudgetService;
import com.example.savemore.service.impl.BudgetServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<?> createBudget(
            @RequestBody BudgetStatusDTO request,
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                budgetService.createOrUpdateBudget(
                        username,
                        request.getCategory(),
                        request.getMonthlyLimit(),
                        request.getMonth()
                )
        );
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(
            @RequestParam String category,
            @RequestParam String month,
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                budgetService.getBudgetStatus(
                        username,
                        category,
                        YearMonth.parse(month)
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBudget(
            @RequestParam String category,
            @RequestParam String month,
            Authentication authentication) {

        String username = authentication.getName();
        YearMonth ym = YearMonth.parse(month);

        budgetService.deleteBudget(username,category,ym);
        return ResponseEntity.ok(
                "Deleted Succesfully"
        );
    }
}
