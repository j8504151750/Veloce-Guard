package com.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entites.ProductVariant;

public interface ProductVariantRepo extends JpaRepository<ProductVariant, Long> {

}
