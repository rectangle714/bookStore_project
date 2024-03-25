package com.bs_batch.controller;

import com.bs_batch.config.BatchScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/batch")
@RequiredArgsConstructor
public class MemberBatchController {
    private final BatchScheduler batchScheduler;

    /* 계정 만료 사용자 배치 수동 실행 */
    @PostMapping("/expiredMember")
    public ResponseEntity<String> expiredMemberBatch() {
        if ("success".equals(batchScheduler.runExpiredMemberJob())) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

}
