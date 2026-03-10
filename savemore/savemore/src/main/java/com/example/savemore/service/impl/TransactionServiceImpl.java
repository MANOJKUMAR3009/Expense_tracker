package com.example.savemore.service.impl;


import com.example.savemore.dto.transaction.*;
import com.example.savemore.model.*;
import com.example.savemore.repository.*;
import com.example.savemore.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public TransactionDTO createTransaction(TransactionDTO request, String username) {

        User user = getUser(username);

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (request.getType() != category.getType()) {
            throw new RuntimeException("Transaction type does not match category type");
        }

        // ✅ Create new Transaction
        Transaction transaction = Transaction.builder()
                .id(request.getId())
                .amount(request.getAmount())
                .type(request.getType())
                .date(request.getDate())
                .description(request.getDescription())
                .category(category)
                .user(user)
                .build();

        // ✅ Save to DB
        Transaction savedTransaction = transactionRepository.save(transaction);

        // ✅ Return DTO
        return mapToDTO(savedTransaction);
    }

    @Override
    public Page<TransactionDTO> getUserTransactions(String username, int page, int size,Pageable pageable) {

        User user = getUser(username);

        Page<Transaction> transactions = transactionRepository.findByUser(user, pageable);

        return transactions.map(this::mapToDTO);
    }

    @Override
    public TransactionDTO updateTransaction(Long id,
                                                    TransactionDTO request,
                                                    String username) {

        User user = getUser(username);

        Transaction transaction = transactionRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!request.getType().equals(category.getType())) {
            throw new RuntimeException("Transaction type does not match category type");
        }

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(category);

        Transaction updated = transactionRepository.save(transaction);

        return mapToDTO(updated);
    }

    @Override
    public void deleteTransaction(Long id, String username) {

        User user = getUser(username);

        Transaction transaction = transactionRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transactionRepository.delete(transaction);
    }

    // 🔐 Utility method
    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    @Override
    public Page<Transaction> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable);
    }
    // 🔄 Mapping method
    private TransactionDTO mapToDTO(Transaction transaction) {

        return TransactionDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .date(transaction.getDate())
                .description(transaction.getDescription())
                .categoryId(transaction.getCategory().getId())
                .categoryName(transaction.getCategory().getName())
                .build();
    }
}
