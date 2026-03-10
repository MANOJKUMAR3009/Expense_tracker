package com.example.savemore.service.impl;

import com.example.savemore.dto.dashboard.BudgetStatusDTO;
import com.example.savemore.model.Budget;
import com.example.savemore.model.User;
import com.example.savemore.repository.BudgetRepository;
import com.example.savemore.repository.TransactionRepository;
import com.example.savemore.repository.UserRepository;
import com.example.savemore.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository; // ✅ Injected properly

    @Override
    public Budget createOrUpdateBudget(String username,
                                       String category,
                                       Double monthlyLimit,
                                       YearMonth month) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository
                .findByUserAndCategoryAndMonth(user, category, month)
                .orElse(new Budget());

        budget.setUser(user);
        budget.setCategory(category);
        budget.setMonthlyLimit(monthlyLimit);
        budget.setMonth(month);

        return budgetRepository.save(budget);
    }

    @Override
    public BudgetStatusDTO getBudgetStatus(String username,
                                           String category,
                                           YearMonth month) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository
                .findByUserAndCategoryAndMonth(user, category, month)
                .orElse(null);

        if (budget == null) {
            return new BudgetStatusDTO(category, 0.0, 0.0, 0.0, 0.0, month);
        }

        Double spent = transactionRepository
                .sumByUserAndCategoryAndMonth(user, category, month.getYear(), month.getMonthValue());

        spent = spent != null ? spent : 0.0;

        Double remaining = budget.getMonthlyLimit() - spent;

        Double percentageUsed = 0.0;
        if (budget.getMonthlyLimit() > 0) {
            percentageUsed = (spent / budget.getMonthlyLimit()) * 100;
        }

        return new BudgetStatusDTO(
                category,
                spent,
                remaining,
                percentageUsed,
                budget.getMonthlyLimit(),
                month
        );
    }
    @Override
    public Budget deleteBudget(String username, String category, YearMonth month) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository
                .findByUserAndCategoryAndMonth(user, category, month)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budgetRepository.delete(budget);
        return budget; // optional: return deleted budget info
    }
}