package com.app.payloads;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO {

	private Long couponId;

	private String code;

	private String discoutType; // "PERCENTAGE" or "FIXED"

	private Double distcountValue;

	private LocalDateTime startDate;

	private LocalDateTime endDate;

	private String conditions;

	private String status; // "ACTIVE", "USED", "EXPIRED"
}
