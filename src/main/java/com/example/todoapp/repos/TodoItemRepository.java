package com.example.todoapp.repos;

import com.example.todoapp.domain.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TodoItemRepository extends JpaRepository<TodoItem, Long> {

    TodoItem findFirstByCategoryId(Long id);

}
