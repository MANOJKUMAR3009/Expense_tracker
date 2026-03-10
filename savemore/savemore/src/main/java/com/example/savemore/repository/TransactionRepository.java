package com.example.savemore.repository;

import com.example.savemore.model.Transaction;
import com.example.savemore.model.User;
import com.example.savemore.model.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUserIdAndType(Long userId,TransactionType type);

    List<Transaction> findByUser(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);



    Page<Transaction> findByUser(User user, Pageable pageable);
    @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    Double getTotalByType(Long userId, TransactionType type);

    @Query("""
       SELECT MONTH(t.date), SUM(t.amount)
       FROM Transaction t
       WHERE t.user.id = :userId AND t.type = :type
       GROUP BY MONTH(t.date)
       """)
    List<Object[]> getMonthlyByType(Long userId, TransactionType type);

    @Query("""
       SELECT t.category.name, SUM(t.amount)
       FROM Transaction t
       WHERE t.user.id = :userId AND t.type = com.example.savemore.model.enums.TransactionType.EXPENSE
       GROUP BY t.category.name
       """)
    List<Object[]> getCategoryBreakdown(Long userId);
    @Query("SELECT SUM(t.amount) FROM Transaction t " +
            "WHERE t.user = :user AND t.category.name = :category " +
            "AND FUNCTION('YEAR', t.date) = :year " +
            "AND FUNCTION('MONTH', t.date) = :month")
    Double sumByUserAndCategoryAndMonth(
            @Param("user") User user,
            @Param("category") String category,
            @Param("year") int year,
            @Param("month") int month
    );

}