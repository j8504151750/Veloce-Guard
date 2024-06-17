package com.app.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
//import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long variantId;

//	@NotBlank
	@Size(max = 15, message = "color name must contain no more than 15 characters")
	private String color;

//	@NotBlank
	@Size(max = 15, message = "size name must contain no more than 15 characters")
	private String size;

	private Integer inventory;
	private String sku;
	private String image;

	@ManyToOne
	@JoinColumn(name = "product_id")
	private Product product;
}
