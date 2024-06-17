package com.app.services;

import org.springframework.stereotype.Service;

import com.app.entites.Role;
import com.app.entites.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class UserCreateService {

	@PersistenceContext
	private EntityManager manager;
	
	@Transactional
	public void createUser(User user) {
		// 獲取預設的角色
		Role admin_role = manager.find(Role.class, 101L);
		Role user_role = manager.find(Role.class, 102L);
		
		// 添加預設角色到用戶角色的集合中
		user.getRoles().add(admin_role);
		user.getRoles().add(user_role);
		
		// 保存用戶
		manager.merge(user);
	}
}
