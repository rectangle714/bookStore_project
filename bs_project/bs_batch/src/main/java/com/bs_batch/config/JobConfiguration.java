package com.bs_batch.config;

import core.member.entity.Member;
import core.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.*;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableBatchProcessing
public class JobConfiguration {

    private final MemberRepository memberRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public Job expiredMemberJob(JobRepository jobRepository, Step step) {
        return new JobBuilder("selectExpiredMemberJob", jobRepository)
                .preventRestart()
                .start(expiredMemberStep(jobRepository))
                .build();
    }

    @Bean
    public Step expiredMemberStep(JobRepository jobRepository) {
        return new StepBuilder("expiredMemberStep", jobRepository)
                .<Member, Member>chunk(100, transactionManager)
                .reader(expiredMemberReader())
                .processor(expiredMemberProcessor())
                .writer(expiredMemberWriter())
                .build();
    }

    @Bean
    @StepScope
    public ListItemReader<Member> expiredMemberReader() {
        log.info("****** 사용자 조회 시작 ******");
        List<Member> expiredMemberList = new ArrayList<>();
        expiredMemberList = memberRepository.findAll();
        log.info("****** 사용자 조회 끝 ******");
        return new ListItemReader<>(expiredMemberList);
    }

    public ItemProcessor<Member, Member> expiredMemberProcessor() {
        return member -> {
            log.info(member.getEmail());
            return member;
        };
    }

    public ItemWriter<Member> expiredMemberWriter() {
        log.info("********** 사용자 writer 시작 **********");
        return memberList -> {
            memberList.forEach(
                    member -> log.info(member.getEmail())
            );
        };
    }

}
