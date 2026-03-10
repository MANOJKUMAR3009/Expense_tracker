package com.example.savemore.controller;


import com.example.savemore.dto.transaction.TransactionDTO;
import com.example.savemore.model.Transaction;
import com.example.savemore.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public TransactionDTO create(
            @Valid @RequestBody TransactionDTO request,
            Authentication authentication) {

        return transactionService.createTransaction(request, authentication.getName());
    }

    @GetMapping
    public Page<TransactionDTO> getTransactions(
            @PageableDefault(sort = "date", direction = Sort.Direction.DESC)
            Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            Authentication authentication) {

        return transactionService.getUserTransactions(
                authentication.getName(),
                page,
                size,pageable
        );
    }
    @GetMapping("/getAll")
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @PageableDefault(sort = "date", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(transactionService.getAllTransactions(pageable));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       Authentication authentication) {

        transactionService.deleteTransaction(id, authentication.getName());
    }
}