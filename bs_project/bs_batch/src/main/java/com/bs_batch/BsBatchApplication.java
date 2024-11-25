package com.bs_batch;

import com.bs_batch.config.JpaAuditingConfig;
import com.bs_batch.config.QueryDslConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@Import({JpaAuditingConfig.class, QueryDslConfig.class})
@SpringBootApplication
public class BsBatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(BsBatchApplication.class, args);
	}

}