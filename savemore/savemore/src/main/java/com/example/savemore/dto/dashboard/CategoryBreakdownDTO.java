package com.example.savemore.dto.dashboard;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryBreakdownDTO {

    private String category;
    private Double total;
}
