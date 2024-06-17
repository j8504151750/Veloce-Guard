package com.app.entites;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long couponId;

	@NotBlank
	@Column(unique = true, nullable = false)
	private String code;

	@Column(nullable = false)
	private String discoutType; // "PERCENTAGE" or "FIXED"

	@Column(nullable = false)
	private Double distcountValue;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate startDate;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate endDate;

	private String conditions;

	@Column(nullable = false)
	private String status; // "ACTIVE", "USED", "EXPIRED"

	private String image;
	
	@ManyToOne
	@JoinColumn(name = "category_id")
	private CategoryCoupon categoryCoupon;

//	private List<Category> applicableCategory;

	@ManyToMany
	@JoinTable(name = "coupon_product", joinColumns = @JoinColumn(name = "coupon_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
	private List<Product> applicableProducts;
}
