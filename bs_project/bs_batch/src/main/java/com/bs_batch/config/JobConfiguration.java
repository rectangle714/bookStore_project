package com.bs_batch.config;

import com.bs_batch.web.member.dto.MemberDTO;
import com.bs_batch.web.member.entity.Member;
import com.bs_batch.web.member.mapper.MemberMapper;
import com.bs_batch.web.member.repository.MemberRepository;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.database.builder.JpaItemWriterBuilder;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableBatchProcessing
public class JobConfiguration {

    private final MemberRepository memberRepository;
    private final PlatformTransactionManager transactionManager;
    private final EntityManagerFactory entityManagerFactory;

    @Bean
    public Job expiredMemberJob(JobRepository jobRepository, Step step) throws Exception {
        return new JobBuilder("selectExpiredMemberJob", jobRepository)
                .preventRestart()
                .start(expiredMemberStep(jobRepository))
                .build();
    }

    @Bean
    public Step expiredMemberStep(JobRepository jobRepository) throws Exception{
        return new StepBuilder("expiredMemberStep", jobRepository)
                .<MemberDTO, Member>chunk(100, transactionManager)
                .reader(expiredMemberReader())
                .processor(expiredMemberProcessor())
                .writer(expiredMemberWriter())
                .build();
    }

    @Bean
    @StepScope
    public ListItemReader<MemberDTO> expiredMemberReader() {
        log.info("****** Batch 사용자 조회 시작 ******");
        List<MemberDTO> expiredMemberList = new ArrayList<>();
        expiredMemberList = memberRepository.findExpiredMember();
        log.info("****** Batch 사용자 조회 끝 ******");
        return new ListItemReader<MemberDTO>(expiredMemberList);
    }

    @Bean
    @StepScope
    public ItemProcessor<MemberDTO, Member> expiredMemberProcessor() {
        List<MemberDTO> expiredMemberList = new ArrayList<MemberDTO>();

        return memberDTO -> {
            if(memberDTO.getLoginDate() == null) {
                memberDTO.setLoginDate(memberDTO.getRegisterDate());
            }

            if(memberDTO.getLoginDate().isBefore(LocalDateTime.now().minusMonths(3))) {
                memberDTO.setExpiredYn("Y");
            } else {
                memberDTO.setExpiredYn("N");
            }

            Member member = MemberMapper.INSTANCE.toMemberBatch(memberDTO);
            return member;
        };
    }

    @Bean
    @StepScope
    public ItemWriter<Member> expiredMemberWriter() throws Exception {
        log.info("********** Batch 사용자 writer 시작 **********");
        JpaItemWriter<Member> memberWriter = new JpaItemWriterBuilder<Member>()
                .entityManagerFactory(entityManagerFactory)
                .build();

        memberWriter.afterPropertiesSet();
        return memberWriter;
    }

}
