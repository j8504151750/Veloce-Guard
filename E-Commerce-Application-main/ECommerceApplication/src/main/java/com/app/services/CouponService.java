package com.app.services;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.app.entites.Coupon;
import com.app.entites.Order;
import com.app.payloads.CouponDTO;
import com.app.payloads.CouponResponse;

public interface CouponService {

	CouponDTO addCoupon(Long cateforyId, Coupon coupon);

	CouponResponse getAllCoupons(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

//	CouponResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

	CouponDTO updateCoupon(Long couponId, Coupon coupon);

	String deleteCoupon(Long couponId);

	CouponDTO applyCoupon(String code, Long orderId);

	double calculateDiscount(Coupon coupon, Order order);

	// 上傳優惠券的方法規格 --> 使用 Data URL 配置
	CouponDTO updateCouponImage(Long couponId, MultipartFile image) throws IOException;
}
