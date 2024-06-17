package com.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entites.CategoryCoupon;

public interface CategoryCouponRepo extends JpaRepository<CategoryCoupon, Long> {

}
