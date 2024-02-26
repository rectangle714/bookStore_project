package com.bootProject.web.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;

    /** 이메일 전송 **/
    public void sendEmail(String toEmail, String title, String text) throws MessagingException {
        MimeMessage message = getEmailForm(toEmail, title, text);

        try {
            javaMailSender.send(message);
        } catch (RuntimeException e) {
            log.error("메일 발송 실패 - toEmail: {}, title: {}, text: {}", toEmail, title, text);
            throw new RuntimeException();
        }
    }

    /** 발신할 이메일 세팅 **/
    private MimeMessage getEmailForm(String toEmail, String title, String text){
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String bodyHtml = makeEmailHTML(text);
            helper.setTo(toEmail);
            helper.setSubject(title);
            helper.setText(bodyHtml, true);
        } catch( MessagingException e ) {
            log.error("에러가 발생 했습니다. 에러 내용 : {}",e.getMessage());
        }
        return message;
    }

    private String makeEmailHTML(String text) {
        String html = "";
        html = "<html>"
                + "<body style='font-family: 'Arial', sans-serif; background-color: #f4f4f4; text-align: center;'>"
                + "<h1 style='color: green; text-align: center;'>안녕하세요 Collie 인증코드 입니다!</h1>"
                + "<div style='margin: 0px; padding: 10px 10px 10px 10px; font-size: 16px; border-spacing: 0; line-height:1.5; word-break:keep-all; word-spacing:-0.5px; color:#333333; background:#f0f4f7; text-align:center; border-radius:8px; font-weight:bold'>" + text + "</div>"
                + "</body>"
                + "</html>";
        return html;
    }
}
