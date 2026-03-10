package com.example.savemore.service;


import com.example.savemore.dto.transaction.*;
import com.example.savemore.model.Transaction;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TransactionService {

    TransactionDTO createTransaction(TransactionDTO request, String username);

    Page<TransactionDTO> getUserTransactions(String username, int page, int size,Pageable pageable);

    TransactionDTO updateTransaction(Long id, TransactionDTO request, String username);

    void deleteTransaction(Long id, String username);

    @Nullable Page<Transaction> getAllTransactions(Pageable pageable);
}