package com.bs_batch.config;

import com.bootProject.web.member.entity.Member;
import com.bootProject.web.member.repository.MemberRepository;
import com.bootProject.web.member.repository.MemberRepositoryImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@EnableBatchProcessing
@Configuration
public class JobConfiguration {

//    @Bean
//    public Job expiredMemberJob(JobRepository jobRepository, Step step) {
//        return new JobBuilder("selectExpiredMember", jobRepository)
//                .preventRestart()
//                .start(step)
//                .build();
//    }
//
//    @Bean
//    public Step expiredMemberJobStep(JobRepository jobRepository, Tasklet myTasklet, PlatformTransactionManager transactionManager) {
//        return new StepBuilder("selectExpiredMember", jobRepository)
//                .chunk(100, transactionManager)
//                .build();
//    }
//
//    @Bean
//    public ListItemReader<Member>




}
