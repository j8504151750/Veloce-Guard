package com.app.services;

import java.io.IOException;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.entites.CategoryCoupon;
import com.app.entites.Coupon;
import com.app.entites.Order;
import com.app.exceptions.APIException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.payloads.CouponDTO;
import com.app.payloads.CouponResponse;
import com.app.repositories.CartRepo;
import com.app.repositories.CategoryCouponRepo;
import com.app.repositories.CouponRepo;
import com.app.repositories.ProductRepo;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class CouponServiceImpl implements CouponService {

	@Autowired
	private CouponRepo couponRepo;

	@Autowired
	private CategoryCouponRepo categoryCouponRepo;

	@Autowired
	private ProductRepo productRepo;

	@Autowired
	private CartRepo cartRepo;

	@Autowired
	private FileService fileService;

	@Autowired
	private ModelMapper modelMapper;

	@Value("${project.image}")
	private String path;

	@Override
	public CouponDTO addCoupon(Long categoryId, Coupon coupon) {

		CategoryCoupon categoryCoupon = categoryCouponRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

		boolean isCouponNotPresent = true;

		List<Coupon> coupons = categoryCoupon.getCoupons();

		for (int i = 0; i < coupons.size(); i++) {
			if (coupons.get(i).getCode().equals(coupon.getCode())) {
				isCouponNotPresent = false;
				break;
			}
		}

		if (isCouponNotPresent) {
			coupon.setConditions("default condition");
			coupon.setStatus("active");
			coupon.setImage("default.png");
			coupon.setCategoryCoupon(categoryCoupon);
			Coupon savedCoupon = couponRepo.save(coupon);
			return modelMapper.map(savedCoupon, CouponDTO.class);
		} else {
			throw new APIException("Coupon already exists.");
		}

	}

	@Override
	public CouponResponse getAllCoupons(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CouponDTO updateCoupon(Long couponId, Coupon coupon) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String deleteCoupon(Long couponId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CouponDTO applyCoupon(String code, Long orderId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public double calculateDiscount(Coupon coupon, Order order) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public CouponDTO updateCouponImage(Long couponId, MultipartFile image) throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

}
