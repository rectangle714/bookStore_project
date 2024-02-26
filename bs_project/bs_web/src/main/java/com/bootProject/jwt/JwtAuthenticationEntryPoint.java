package com.bootProject.jwt;

import com.bootProject.common.code.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.apache.bcel.classfile.Code;
import org.json.JSONObject;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        String exception = (String)request.getAttribute("exception");

        if(exception == null) {
            setResponse(response, ErrorCode.WRONG_TYPE_TOKEN);
        } else if(ErrorCode.EXPIRED_TOKEN.getCode().equals(exception)) {
            setResponse(response, ErrorCode.EXPIRED_TOKEN);
        } else if(ErrorCode.TOKEN_NOT_EXISTS.getCode().equals(exception)) {
            setResponse(response, ErrorCode.TOKEN_NOT_EXISTS);
        } else if(ErrorCode.WRONG_TYPE_TOKEN.getCode().equals(exception)) {
            setResponse(response, ErrorCode.WRONG_TYPE_TOKEN);
        } else {
            setResponse(response, ErrorCode.UNAUTHORIZED);
        }
    }

    //한글 출력을 위해 getWriter() 사용
    private void setResponse(HttpServletResponse response, ErrorCode code) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        JSONObject responseJson = new JSONObject();
        responseJson.put("code", code.getCode());
        responseJson.put("message", code.getDescription());

        response.getWriter().print(responseJson);
    }
}
