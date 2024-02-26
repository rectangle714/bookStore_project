package com.bootProject.web.member.service;

import com.bootProject.common.code.ErrorCode;
import com.bootProject.common.exception.BusinessException;
import com.bootProject.common.util.RedisUtil;
import com.bootProject.common.util.SecurityUtil;
import com.bootProject.web.member.dto.MemberDTO;
import com.bootProject.web.member.entity.Member;
import com.bootProject.web.mail.MailService;
import com.bootProject.web.member.mapper.MemberMapper;
import com.bootProject.web.member.repository.MemberRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberService {
    private static final String AUTH_CODE_PREFIX = "AuthCode ";
    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;
    private final MailService mailService;
    private final MemberRepository memberRepository;
    private final RedisUtil redisUtil;
    private final PasswordEncoder passwordEncoder;

    public MemberDTO getMyInfoBySecurity() {
        String email = SecurityUtil.getCurrentMemberEmail();
        MemberDTO memberDTO = memberRepository.findByEmail(SecurityUtil.getCurrentMemberEmail())
                .map(MemberMapper.INSTANCE::toDTO)
                .orElseThrow(() -> new RuntimeException("로그인 유저 정보가 없습니다."));
        return memberDTO;
    }

    @Transactional
    public void changeMemberInfo(MemberDTO memberDTO) throws BusinessException{
        Member member = memberRepository.findByEmail(memberDTO.getEmail()).orElseThrow(() ->
            new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND, ErrorCode.ACCOUNT_NOT_FOUND.getDescription())
        );
        member.updateMember(
                passwordEncoder.encode(memberDTO.getPassword()), memberDTO.getPhone(),
                memberDTO.getNickname(), memberDTO.getZipNo(), memberDTO.getAddress(), memberDTO.getAddressDetail()
        );
        memberRepository.save(member);
    }

    @Transactional
    public String changeMemberPassword(String email, String password) {
        String resultMessage = "";
        try {
            Member member = memberRepository.findByEmail(email).orElseThrow(() ->
                new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND, ErrorCode.ACCOUNT_NOT_FOUND.getDescription())
            );
            member.updateMemberPassword(passwordEncoder.encode(password));
            return "success";
        } catch (Exception e) {
            log.error(e.getMessage());
            return "fail";
        }
    }

    public List<Member> findAllMember() {
        return memberRepository.findAll();
    }

    public Member findByEmail(String email, String path) {
        Member member = memberRepository.findByEmail(email).orElseGet(() -> null);
        // 패스워드 찾기에서 Email 체크 시 social 아이디인지 체크 필요함
        if(null != path) {
            if(null != member && null != member.getSocialType()) {
                return null;
            }
        }
        return member;
    }

    public void sendCodeToEmail(String toEmail) throws MessagingException {
        String title = "이메일 인증번호";
        String authCode = createCode();
        mailService.sendEmail(toEmail, title, authCode);
        redisUtil.setData(AUTH_CODE_PREFIX + toEmail,
                authCode, Duration.ofMillis(authCodeExpirationMillis).toMillis());

    }

    /* 이메일 인증 코드 생성 */
    private String createCode() {
        int length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for(int i=0; i<length; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error("이메일 인증코드 생성중 오류발생");
            return null;
        }
    }

    /* 이메일 코드 검증  */
    public boolean verifiedCode(String email, String authCode) {
        String redisAuthCode = redisUtil.getData(AUTH_CODE_PREFIX + email);
        boolean authResult = null != redisAuthCode && redisAuthCode.equals(authCode);

        return authResult;
    }

}
