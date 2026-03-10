package com.example.savemore.repository;

import com.example.savemore.model.Budget;
import com.example.savemore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

      Optional<Budget> findByUserAndCategoryAndMonth(
             User user,
             String category,
             YearMonth month
     );
}
