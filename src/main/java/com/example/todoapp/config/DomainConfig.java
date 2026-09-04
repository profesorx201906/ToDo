package com.example.todoapp.config;

import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("com.example.todoapp.domain")
@EnableJpaRepositories("com.example.todoapp.repos")
@EnableTransactionManagement
public class DomainConfig {
}
