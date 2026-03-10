package com.example.savemore.service.impl;


import com.example.savemore.dto.dashboard.*;
import com.example.savemore.model.User;
import com.example.savemore.model.enums.TransactionType;
import com.example.savemore.repository.TransactionRepository;
import com.example.savemore.repository.UserRepository;
import com.example.savemore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    @Override
    public DashboardSummaryDTO getSummary(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        Double totalIncome =
                transactionRepository.getTotalByType(userId, TransactionType.INCOME);

        Double totalExpense =
                transactionRepository.getTotalByType(userId, TransactionType.EXPENSE);

        Double balance = totalIncome - totalExpense;

        return new DashboardSummaryDTO(totalIncome, totalExpense, balance);
    }

    @Override
    public List<MonthlyReportDTO> getMonthlyOverview(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        List<Object[]> incomeData =
                transactionRepository.getMonthlyByType(userId, TransactionType.INCOME);

        List<Object[]> expenseData =
                transactionRepository.getMonthlyByType(userId, TransactionType.EXPENSE);

        Map<Integer, Double> incomeMap = new HashMap<>();
        Map<Integer, Double> expenseMap = new HashMap<>();

        for (Object[] obj : incomeData) {
            incomeMap.put((Integer) obj[0], (Double) obj[1]);
        }

        for (Object[] obj : expenseData) {
            expenseMap.put((Integer) obj[0], (Double) obj[1]);
        }

        List<MonthlyReportDTO> result = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            Double income = incomeMap.getOrDefault(month, 0.0);
            Double expense = expenseMap.getOrDefault(month, 0.0);
            result.add(new MonthlyReportDTO(month, income, expense));
        }

        return result;
    }

    @Override
    public List<CategoryBreakdownDTO> getCategoryBreakdown(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        List<Object[]> data =
                transactionRepository.getCategoryBreakdown(userId);

        List<CategoryBreakdownDTO> result = new ArrayList<>();

        for (Object[] obj : data) {
            result.add(new CategoryBreakdownDTO(
                    (String) obj[0],
                    (Double) obj[1]
            ));
        }

        return result;
    }

    public DashboardResponseDTO getDashboard(String username) {

        DashboardSummaryDTO summary = getSummary(username);
        List<MonthlyReportDTO> monthlyOverview = getMonthlyOverview(username);
        List<CategoryBreakdownDTO> categoryBreakdown = getCategoryBreakdown(username);

        return new DashboardResponseDTO(
                summary,
                monthlyOverview,
                categoryBreakdown
        );
    }
}