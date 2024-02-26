package com.bootProject.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Aspect
@Component
@Slf4j
public class LogAspect {

    @Around("execution(public * com.bootProject.controller.*.*(..))")
    public Object logRequestTime(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("{} 요청 시작 - {}", joinPoint.getSignature(),LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS")));
        Object result = joinPoint.proceed();
        log.info("{} 요청 완료 - {}", joinPoint.getSignature(),LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS")));

        return result;
    }

}
