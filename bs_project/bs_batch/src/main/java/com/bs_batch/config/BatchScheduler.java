package com.bs_batch.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class BatchScheduler {

    private final JobLauncher jobLauncher;
    private final JobRepository jobRepository;
    private final Step step;
    private final JobConfiguration jobConfiguration;

    @Scheduled(cron = "0 2 * * *")
    public String runExpiredMemberJob() {
        // job parameter 설정
        JobParameters jobParameters = new JobParametersBuilder().addLong("time", System.currentTimeMillis()).toJobParameters();
        try{
            log.info("---- 만료된 사용자 Batch 실행 -----");
            jobLauncher.run(jobConfiguration.expiredMemberJob(jobRepository, step), jobParameters);
            return "success";
        } catch(Exception e) {
            log.info("scheduler runExpiredMemberJob 에러 발생 : "+e.getMessage());
            return "fail";
        }
    }

}
