package com.example.todoapp.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CategoryDTO {

    private Long id;

    @NotNull
    @Size(max = 100)
    @CategoryNameUnique
    private String name;

    @Size(max = 7)
    private String color;

}
