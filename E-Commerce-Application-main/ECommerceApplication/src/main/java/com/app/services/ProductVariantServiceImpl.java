package com.app.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.entites.Product;
import com.app.entites.ProductVariant;
import com.app.exceptions.APIException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.payloads.ProductVariantDTO;
import com.app.payloads.ProductVariantResponse;
import com.app.repositories.ProductRepo;
import com.app.repositories.ProductVariantRepo;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class ProductVariantServiceImpl implements ProductVariantService {

	@Autowired
	private ProductRepo productRepo;

	@Autowired
	private ProductVariantRepo variantRepo;

	@Autowired
	private FileService fileService;

	@Autowired
	private ModelMapper modelMapper;

	@Value("${project.image}")
	private String path;

	@Override
	public ProductVariantDTO addProductVariantById(Long productId, ProductVariant variant) {
		// 找出哪一個產品需要新增變體
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
		// 宣告產品變體是否存在的布林值
		boolean isProductVariantPresent = true;
		// 從指定的產品當中取出所有的變體
		List<ProductVariant> variants = product.getVariants();
		// 遊歷所有的產品變體以便確保新增的變體沒有重複
		for (int i = 0; i < variants.size(); i++) {
			if (variants.get(i).getColor().equals(variant.getColor())
					&& variants.get(i).getSku().equals(variant.getSku())) {
				isProductVariantPresent = false;
				break;
			}
		}
		// 如果新增的變體沒有重複，則進行新增
		if (isProductVariantPresent) {
			// 對持久化實體(產品變體)進行關聯
			variant.setProduct(product);
			// 修改產品的總數
			Integer quantity = product.getQuantity() + variant.getInventory();
			product.setQuantity(quantity);

			Product savedProduct = productRepo.save(product);
			ProductVariant savedProductVariant = variantRepo.save(variant);

			System.out.println("savedProduct: " + savedProduct);

			return modelMapper.map(savedProductVariant, ProductVariantDTO.class);
		} else {
			throw new APIException("ProductVariant already exists");
		}
	}

	@Override
	public List<ProductVariantDTO> addProductVariantsById(Long productId, List<ProductVariant> variants) {
		// TODO Auto-generated method stub
		return null;
	}

//	@Override
//	public ProductVariantResponse getAllProductVariantsById(Long productId, Integer pageNumber, Integer pageSize,
//			String sortBy, String sortOrder) {
//		Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
//				: Sort.by(sortBy).descending();
//		Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
//		Page<ProductVariant> pageProductVariants = variantRepo.findAll(pageDetails);
//
//		List<ProductVariant> variants = pageProductVariants.getContent();
//		List<ProductVariantDTO> variantDTOs = variants.stream()
//				.map(variant -> modelMapper.map(variant, ProductVariantDTO.class)).collect(Collectors.toList());
//		ProductVariantResponse variantResponse = new ProductVariantResponse();
//
//		variantResponse.setContent(variantDTOs);
//		variantResponse.setPageNumber(pageProductVariants.getNumber());
//		variantResponse.setPageSize(pageProductVariants.getSize());
//		variantResponse.setTotalElements(pageProductVariants.getTotalElements());
//		variantResponse.setTotalPages(pageProductVariants.getTotalPages());
//		variantResponse.setLastPage(pageProductVariants.isLast());
//
//		return variantResponse;
//	}

	@Override
	public List<ProductVariantDTO> getAllProductVariantsById(Long productId, Integer pageNumber, Integer pageSize,
			String sortBy, String sortOrder) {
		Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending();
		Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
		Page<ProductVariant> pageProductVariants = variantRepo.findAll(pageDetails);

		List<ProductVariant> variants = pageProductVariants.getContent();
		List<ProductVariantDTO> variantDTOs = variants.stream()
				.map(variant -> modelMapper.map(variant, ProductVariantDTO.class)).collect(Collectors.toList());

		return variantDTOs;
	}

	@Override
	public ProductVariantDTO updateProductVariant(Long productId, ProductVariant variant) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ProductVariantDTO updateProductImage(Long productId, String color, MultipartFile image) throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteProductVariantById(Long productId) {
		// TODO Auto-generated method stub
		return null;
	}

}
