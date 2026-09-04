package com.example.todoapp.service;

import com.example.todoapp.domain.Category;
import com.example.todoapp.domain.TodoItem;
import com.example.todoapp.events.BeforeDeleteCategory;
import com.example.todoapp.model.TodoItemDTO;
import com.example.todoapp.repos.CategoryRepository;
import com.example.todoapp.repos.TodoItemRepository;
import com.example.todoapp.util.NotFoundException;
import com.example.todoapp.util.ReferencedException;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TodoItemService {

    private final TodoItemRepository todoItemRepository;
    private final CategoryRepository categoryRepository;

    public TodoItemService(final TodoItemRepository todoItemRepository,
            final CategoryRepository categoryRepository) {
        this.todoItemRepository = todoItemRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TodoItemDTO> findAll() {
        final List<TodoItem> todoItems = todoItemRepository.findAll(Sort.by("id"));
        return todoItems.stream()
                .map(todoItem -> mapToDTO(todoItem, new TodoItemDTO()))
                .toList();
    }

    public TodoItemDTO get(final Long id) {
        return todoItemRepository.findById(id)
                .map(todoItem -> mapToDTO(todoItem, new TodoItemDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final TodoItemDTO todoItemDTO) {
        final TodoItem todoItem = new TodoItem();
        mapToEntity(todoItemDTO, todoItem);
        return todoItemRepository.save(todoItem).getId();
    }

    public void update(final Long id, final TodoItemDTO todoItemDTO) {
        final TodoItem todoItem = todoItemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(todoItemDTO, todoItem);
        todoItemRepository.save(todoItem);
    }

    public void delete(final Long id) {
        final TodoItem todoItem = todoItemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        todoItemRepository.delete(todoItem);
    }

    private TodoItemDTO mapToDTO(final TodoItem todoItem, final TodoItemDTO todoItemDTO) {
        todoItemDTO.setId(todoItem.getId());
        todoItemDTO.setTitle(todoItem.getTitle());
        todoItemDTO.setDescription(todoItem.getDescription());
        todoItemDTO.setPriority(todoItem.getPriority());
        todoItemDTO.setDueDate(todoItem.getDueDate());
        todoItemDTO.setCompleted(todoItem.getCompleted());
        todoItemDTO.setCreatedAt(todoItem.getCreatedAt());
        todoItemDTO.setUpdatedAt(todoItem.getUpdatedAt());
        todoItemDTO.setCategory(todoItem.getCategory() == null ? null : todoItem.getCategory().getId());
        return todoItemDTO;
    }

    private TodoItem mapToEntity(final TodoItemDTO todoItemDTO, final TodoItem todoItem) {
        todoItem.setTitle(todoItemDTO.getTitle());
        todoItem.setDescription(todoItemDTO.getDescription());
        todoItem.setPriority(todoItemDTO.getPriority());
        todoItem.setDueDate(todoItemDTO.getDueDate());
        todoItem.setCompleted(todoItemDTO.getCompleted());
        todoItem.setCreatedAt(todoItemDTO.getCreatedAt());
        todoItem.setUpdatedAt(todoItemDTO.getUpdatedAt());
        final Category category = todoItemDTO.getCategory() == null ? null : categoryRepository.findById(todoItemDTO.getCategory())
                .orElseThrow(() -> new NotFoundException("category not found"));
        todoItem.setCategory(category);
        return todoItem;
    }

    @EventListener(BeforeDeleteCategory.class)
    public void on(final BeforeDeleteCategory event) {
        final ReferencedException referencedException = new ReferencedException();
        final TodoItem categoryTodoItem = todoItemRepository.findFirstByCategoryId(event.getId());
        if (categoryTodoItem != null) {
            referencedException.setKey("category.todoItem.category.referenced");
            referencedException.addParam(categoryTodoItem.getId());
            throw referencedException;
        }
    }

}
