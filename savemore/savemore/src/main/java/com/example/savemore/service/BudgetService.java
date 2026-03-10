package com.example.savemore.service;

import com.example.savemore.dto.dashboard.BudgetStatusDTO;
import com.example.savemore.model.Budget;

import java.time.YearMonth;

public interface BudgetService {

    Budget createOrUpdateBudget(String username,
                                String category,
                                Double monthlyLimit,
                                YearMonth month);

    public BudgetStatusDTO getBudgetStatus(String username,
                                           String category,
                                           YearMonth month);

    Budget deleteBudget(String username, String category, YearMonth month);
}
