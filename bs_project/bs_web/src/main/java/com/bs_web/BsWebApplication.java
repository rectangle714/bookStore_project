package com.bs_web;

import config.JpaAuditingConfig;
import config.QueryDslConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Import({JpaAuditingConfig.class, QueryDslConfig.class})
@SpringBootApplication(scanBasePackages = {"core","com.bs_web"})
@EntityScan(basePackages = {"core"})
@EnableJpaRepositories(basePackages = {"core"})
@Slf4j
public class BsWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(BsWebApplication.class, args);
	}

}
