package com.app.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.entites.Category;
import com.app.entites.Product;
import com.app.entites.ProductVariant;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class ProductCreateService {

	@PersistenceContext
	private EntityManager entityManager;

	@Transactional
	public void addProductWithVariants(Product product, List<ProductVariant> variants) {
		// 設置每個 ProductVariant 的關聯 Product
		for (ProductVariant variant : variants) {
			variant.setProduct(product);
		}
		// 將所有變體添加到產品的變體列表中
		product.getVariants().addAll(variants);

		// 持久化產品與其關聯的變體
		entityManager.merge(product);
	}

	@Transactional
	public void createProduct(List<Product> products, Long category_Id) {

		Category category;

		try {
			// 獲取預設的產品種類
			category = entityManager.find(Category.class, category_Id);
		} catch (IllegalArgumentException e) {
			System.out.println(e);
			return;
		}

		if (category == null) {
			throw new EntityNotFoundException("Category not found for ID: " + category_Id);
		}

		// 確保每個產品的類別屬性正確配置
		for (Product product : products) {
			product.setCategory(category);
		}

		// 添加預設角色到用戶角色的集合中
		category.setProducts(products);

		// 不需要顯示呼叫 persist，因為 category 已經是持久化的的實體
		// 保存用戶
		entityManager.merge(category);
	}
}
