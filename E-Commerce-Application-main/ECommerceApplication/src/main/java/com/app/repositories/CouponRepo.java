package com.app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entites.Coupon;

public interface CouponRepo extends JpaRepository<Coupon, Long> {

	Optional<Coupon> findByCode(String code);
}
