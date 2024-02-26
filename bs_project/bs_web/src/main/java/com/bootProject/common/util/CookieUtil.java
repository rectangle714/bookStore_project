package com.bootProject.common.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Component
public class CookieUtil {
    @Value("${jwt.token.accessTokenExpireTime}")
    int accessTokenExpireTime;

    public Cookie createCookie(String cookieName, String value) {
        Cookie token = new Cookie(cookieName, value);
        token.setHttpOnly(true);
        token.setMaxAge(accessTokenExpireTime);
        token.setPath("/");
        return token;
    }

    public Cookie getCookie(HttpServletRequest req, String cookieName){
        final Cookie[] cookies = req.getCookies();
        if(cookies==null) return null;
        for(Cookie cookie : cookies){
            if(cookie.getName().equals(cookieName))
                return cookie;
        }
        return null;
    }

    public void expiringCookie(HttpServletRequest request, HttpServletResponse response, String cookieName){
        Optional.ofNullable(request.getCookies())
                .ifPresent(cookieArr -> Arrays.stream(cookieArr)
                        .filter(cookie -> cookie.getName().equals(cookieName))
                        .findFirst()
                        .ifPresent(cookie -> {
                            cookie.setMaxAge(0); // 만료시키기
                            response.addCookie(cookie); // 응답에 추가하기
                        }));
    }

}
