package com.example.todoapp.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TodoItemDTO {

    private Long id;

    @NotNull
    @Size(max = 150)
    private String title;

    private String description;

    @NotNull
    @Size(max = 20)
    private String priority;

    private LocalDate dueDate;

    @NotNull
    private Boolean completed;

    @NotNull
    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private Long category;

}
