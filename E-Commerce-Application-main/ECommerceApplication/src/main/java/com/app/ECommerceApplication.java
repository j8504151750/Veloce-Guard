package com.app;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.config.AppConstants;
import com.app.entites.Address;
import com.app.entites.Cart;
import com.app.entites.Category;
import com.app.entites.Product;
import com.app.entites.ProductVariant;
import com.app.entites.Role;
import com.app.entites.User;
import com.app.repositories.CartRepo;
import com.app.repositories.CategoryRepo;
import com.app.repositories.RoleRepo;
import com.app.repositories.UserRepo;
import com.app.services.ProductCreateService;
import com.app.services.UserCreateService;
import com.app.utilts.JsonParserUtils;
import com.app.utilts.LocalDateAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SpringBootApplication
@SecurityScheme(name = "E-Commerce Application", scheme = "bearer", type = SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER)
public class ECommerceApplication implements CommandLineRunner {

	@Autowired
	private RoleRepo roleRepo;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private CartRepo cartRepo;

	@Autowired
	private UserCreateService createService;

	@Autowired
	private CategoryRepo categoryRepo;

	@Autowired
	private ProductCreateService createService2;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(ECommerceApplication.class, args);
	}

	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Override
	public void run(String... args) throws Exception {
		// 初始化使用者角色
		initialize_roles();
		// 初始化使用者
		initialize_users();
		// 初始化產品種類
		initialize_categories();
		// 初始化產品
		initialize_products();
	}

	void initialize_roles() {

		// ----- 初始化使用者權限角色 -----

		Role adminRole = new Role();
		adminRole.setRoleId(AppConstants.ADMIN_ID);
		adminRole.setRoleName("ADMIN");

		Role userRole = new Role();
		userRole.setRoleId(AppConstants.USER_ID);
		userRole.setRoleName("USER");

		List<Role> roles = List.of(adminRole, userRole);
		// 保存權限使用者列表
		List<Role> savedRoles = roleRepo.saveAll(roles);
		savedRoles.forEach(System.out::println);
	}

	void initialize_users() {

		// ----- 初始化使用者 -----
		Gson gson = new GsonBuilder().registerTypeAdapter(LocalDate.class, new LocalDateAdapter()).create();
		String fileName = "users.json";

		// 獲取當前的JSON檔案的陣列
		JSONArray root = JsonParserUtils.readFile(fileName);

		// 獲得資料庫的角色資料
		for (int i = 0; i < root.length(); i++) {

			// 獲取當前的JSON對象
			JSONObject object = root.getJSONObject(i);
			System.out.println("object: " + object);

			// 解析地址
			List<Address> addresses = new ArrayList<>();
			Address address = gson.fromJson(object.getJSONObject("address").toString(), Address.class);
			addresses.add(address);

			// 設置密碼
			String pwd = object.getString("password");
			System.out.println("password: " + pwd);

			// 創建購物車對象
			Cart cart = new Cart();

			// 轉換JSON對象為User對象
			User user = gson.fromJson(object.toString(), User.class);
			user.setAddresses(addresses);
			user.setPassword(passwordEncoder.encode(pwd));
			user.setCart(cart);

			System.out.println("user: " + user);

			cart.setUser(user);

			// 保存使用者對象
			userRepo.save(user);
			cartRepo.save(cart);
			createService.createUser(user);
		}
	}

	void initialize_categories() {

		// ----- 初始化產品種類 -----
		Category category = new Category();
		category.setCategoryId(AppConstants.HELMET_ID);
		category.setCategoryName("安全帽");

		Category category2 = new Category();
		category2.setCategoryId(AppConstants.PROTECTIVE_GEAR_ID);
		category2.setCategoryName("防摔衣");

		Category category3 = new Category();
		category3.setCategoryId(AppConstants.PROTECTIVE_GLOVES_ID);
		category3.setCategoryName("防摔手套");

		List<Category> categories = List.of(category, category2, category3);
		// 保存產品種類列表
		List<Category> savedCategories = categoryRepo.saveAll(categories);
		savedCategories.forEach(System.out::println);
	}

	void initialize_products() {

		// ----- 初始化產品 -----
		Gson gson2 = new GsonBuilder().registerTypeAdapter(LocalDate.class, new LocalDateAdapter()).create();
		String fileName2 = "products.json";

		// 獲取當前的JSON檔案的陣列
		JSONArray all_products_json = JsonParserUtils.readFile(fileName2);

		// 設置產品變體的產品編號
		Long auto_increment = 1L;

		// 產品種類的編號
		Long c = AppConstants.HELMET_ID;

		// 初始化計數器
		int count = 0;
		// 初始化存放產品的列表
		List<Product> products = new ArrayList<>();

		// 遊歷陣列內的所有產品物件
		for (int i = 0; i < all_products_json.length(); i++) {

			// 獲取當前的JSON對象
			JSONObject products_json = all_products_json.getJSONObject(i);

			// 轉換JSON物件為產品物件
			Product product = gson2.fromJson(products_json.toString(), Product.class);
//			System.out.println("product: " + product);

			// 開始解析產品物件內的產品變體
			JSONArray variants = products_json.getJSONArray("productVariants");

			// 存放產品變體的陣列
			List<ProductVariant> productVariants = new ArrayList<ProductVariant>();

			for (int j = 0; j < variants.length(); j++) {

				// 獲取當前的JSON對象
				JSONObject variant = variants.getJSONObject(j);

				// 轉換JSON物件為產品變體物件
				ProductVariant productVariant = gson2.fromJson(variant.toString(), ProductVariant.class);
				productVariant.setVariantId(auto_increment);
				auto_increment++;
//				System.out.println("productVariant: " + productVariant);

				// 新增產品變體到陣列
				productVariants.add(productVariant);
			}
			// 設置產品預設的庫存數量
			product.setQuantity(0);

			// 設置產品變體陣列到產品物件
			product.setVariants(productVariants);

			createService2.addProductWithVariants(product, productVariants);

			// 新增產品到陣列
			products.add(product);

			// 用來檢查每十筆產品為一組的函式
			if (++count % 10 == 0) {
				createService2.createProduct(products, c);
				c++;
				products.clear();
			}
		}
		// 處理剩餘的產品(如果有)
		if (!products.isEmpty()) {
			createService2.createProduct(products, c);
		}
	}
}
