package com.bootProject.web.member;

import com.bootProject.web.common.entity.Role;
import com.bootProject.web.member.entity.Member;
import com.bootProject.web.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@SpringBootTest
public class memberTest {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    MemberRepository memberRepository;

    @Test
    @DisplayName("계정생성 테스트")
    void createMemberTest() {
        String password = passwordEncoder.encode("123");

        List<Member> memberList = new ArrayList<Member>();

        Member user = Member.builder()
                .name("사용자")
                .email("test")
                .password(password)
                .role(Role.USER)
                .build();

        memberList.add(user);

        Member admin = Member.builder()
                .name("관리자")
                .email("admin")
                .password(password)
                .role(Role.ADMIN)
                .build();

        memberList.add(admin);

        memberRepository.saveAll(memberList);
    }

    @Test
    @DisplayName("사용자 정보 변경")
    void updateMember() {
        log.debug(passwordEncoder.encode("123"));
        Optional<Member> admin = memberRepository.findByEmail("admin");
        admin.get().updateMember(passwordEncoder.encode("123"), "01011112222", "관리자123", "", "", "");
        memberRepository.save(admin.get());
    }

}
