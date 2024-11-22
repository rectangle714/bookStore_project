package com.bs_web.web.auth.controller;import com.bs_web.common.exception.BusinessException;import com.bs_web.security.TokenDTO;import com.bs_web.security.jwt.TokenProvider;import com.bs_web.web.auth.service.AuthService;import com.bs_web.web.member.service.MemberService;import com.bs_web.web.auth.dto.KakaoLoginDTO;import com.bs_web.web.member.dto.MemberDTO;import com.bs_web.web.member.entity.Member;import jakarta.servlet.http.HttpServletRequest;import jakarta.servlet.http.HttpServletResponse;import jakarta.websocket.server.PathParam;import lombok.RequiredArgsConstructor;import lombok.extern.slf4j.Slf4j;import org.springframework.http.HttpStatus;import org.springframework.http.ResponseEntity;import org.springframework.web.bind.annotation.*;@Slf4j@RestController@RequestMapping("/api/v1/auth")@RequiredArgsConstructorpublic class AuthController {    private final AuthService authService;    private final MemberService memberService;    private final TokenProvider tokenProvider;    /* 회원가입 */    @PostMapping("/signup")    public ResponseEntity<Object> signup(@RequestBody MemberDTO memberDto) throws BusinessException {        String result = "";        try {            result = authService.signup(memberDto);            return ResponseEntity.ok(result);        } catch (Exception e){            return ResponseEntity.ok(e.getMessage());        }    }    /* 로그인 */    @PostMapping("/login")    public ResponseEntity<TokenDTO> login(HttpServletRequest request, @RequestBody(required = false) MemberDTO memberDto) {        return ResponseEntity.ok(authService.login(request, memberDto));    }    /* 로그아웃 */    @PostMapping("/logout")    public void logOut(HttpServletRequest request, HttpServletResponse response) {        authService.logOut(request, response);    }    @GetMapping("/checkEmail")    public ResponseEntity<Boolean> emailCheck(@PathParam(value = "email") String email,                                              @RequestParam(value = "path", required = false) String path) {        Member member = memberService.findByEmail(email, path);        if( null != member ) {            return ResponseEntity.ok(false);        } else {            return ResponseEntity.ok(true);        }    }    /* Auth 2.0 Login (네이버) */    @PostMapping("/naverLogin")    public ResponseEntity<TokenDTO> naverLogin(HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "token", required = false)String accessToken) throws Exception {        TokenDTO responseToken = authService.getNaverUserByToken(accessToken);        return ResponseEntity.ok(responseToken);    }    /* Auth 2.0 Login (카카오) */    @PostMapping("/kakaoLogin")    public ResponseEntity<TokenDTO> kakaoLogin(HttpServletRequest request, HttpServletResponse response, @RequestBody KakaoLoginDTO param) {        TokenDTO responseToken = authService.getKakaoUserByToken(param);        return ResponseEntity.ok(responseToken);    }    /* 이메일로 인증코드 전송 */    @GetMapping("/verificationRequests")    public ResponseEntity<HttpStatus> sendMessage(@RequestParam("email") String email) {        try {            memberService.sendCodeToEmail(email);            return new ResponseEntity(HttpStatus.OK);        } catch (Exception e) {            log.error(e.getMessage());            return new ResponseEntity<>(HttpStatus.NO_CONTENT);        }    }    /* 이메일로 전송된 코드 체크  */    @PostMapping(value = "/verifications", produces = "application/json")    public ResponseEntity<Boolean> verificationEmail(@RequestParam("email")String email,                                                     @RequestParam("authCode")String authCode) {        boolean result = memberService.verifiedCode(email, authCode);        return new ResponseEntity<>(result, HttpStatus.OK);    }}