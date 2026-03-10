package com.example.savemore.repository;

import com.example.savemore.model.Category;
import com.example.savemore.model.Transaction;
import com.example.savemore.model.User;
import com.example.savemore.model.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserId(Long userId);


    List<Category> findByUserAndType(User user, TransactionType type);

    Optional<Category> findByIdAndUser(Long id, User user);

    List<Category> findByUser(Long userId);
}