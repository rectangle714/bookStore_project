package com.bs_batch;

import config.JpaAuditingConfig;
import config.QueryDslConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"core","com.bs_batch"})
@EntityScan(basePackages = {"core"})
@EnableJpaRepositories(basePackages = {"core"})
@Import({JpaAuditingConfig.class, QueryDslConfig.class})
public class BsBatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(BsBatchApplication.class, args);
	}

}