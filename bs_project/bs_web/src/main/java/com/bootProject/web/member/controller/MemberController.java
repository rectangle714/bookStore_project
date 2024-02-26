package com.bootProject.web.member.controller;

import com.bootProject.common.exception.BusinessException;
import com.bootProject.web.member.dto.MemberDTO;
import com.bootProject.web.member.entity.Member;
import com.bootProject.web.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member")
public class MemberController {
    private final MemberService memberService;

    /* 마이페이지 */
    @GetMapping("/me")
    public ResponseEntity<MemberDTO> findMemberInfo() {
        MemberDTO myInfoBySecurity = memberService.getMyInfoBySecurity();
        return ResponseEntity.ok(myInfoBySecurity);
    }

    /* 사용자 정보 변경 */
    @PostMapping("/update")
    public ResponseEntity<String> setMemberNickname(@RequestBody MemberDTO request) throws BusinessException {
        memberService.changeMemberInfo(request);
        return ResponseEntity.ok("success");
    }

    /* 패스워드 변경 */
    @PostMapping("/updatePassword")
    public ResponseEntity<String> updateMemberPassword(@RequestParam(value = "email") String email,
                                                          @RequestParam(value = "password") String password) {
        String resultMessage = memberService.changeMemberPassword(email, password);
        return ResponseEntity.ok(resultMessage);
    }

    /* 전체 사용자 조회 */
    @GetMapping("/findAll")
    public ResponseEntity<List<Member>> findAll() {
        return ResponseEntity.ok(memberService.findAllMember());
    }

}
