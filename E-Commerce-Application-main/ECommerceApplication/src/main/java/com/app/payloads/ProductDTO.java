package com.app.payloads;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
	
	private Long productId;
	private String productName;
	private String image;
	private String description;
	private Integer quantity;
	private double productPrice;
	private double discount;
	private double specialPrice;

	private List<ProductVariantDTO> productVariants;
}
