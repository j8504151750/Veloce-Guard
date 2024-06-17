package com.app.entites;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "categories_coupon")
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCoupon {

	@Id
	private Long categoryId;
	
	@NotBlank
	@Size(min = 1, message = "Category name must contain atleast 1 characters")
	private String categoryName;
	
	@OneToMany(mappedBy = "categoryCoupon", cascade = CascadeType.ALL)
	private List<Coupon> coupons;
}
