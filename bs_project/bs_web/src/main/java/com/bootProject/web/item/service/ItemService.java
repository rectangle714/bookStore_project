package com.bootProject.web.item.service;

import com.bootProject.common.code.ErrorCode;
import com.bootProject.common.exception.BusinessException;
import com.bootProject.web.cart.repository.CartRepository;
import com.bootProject.web.item.dto.ItemDTO;
import com.bootProject.web.item.dto.ReviewDTO;
import com.bootProject.web.item.entity.Item;
import com.bootProject.web.item.entity.Review;
import com.bootProject.web.item.entity.SaveFile;
import com.bootProject.web.item.mapper.ReviewMapper;
import com.bootProject.web.item.repository.review.ReviewRepository;
import com.bootProject.web.item.repository.file.FileRepository;
import com.bootProject.web.item.repository.item.ItemRepository;
import com.bootProject.web.member.entity.Member;
import com.bootProject.web.member.repository.MemberRepository;
import com.bootProject.web.item.dto.PaymentDTO;
import com.bootProject.web.item.entity.Payment;
import com.bootProject.web.item.mapper.PaymentMapper;
import com.bootProject.web.item.repository.payment.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ItemService {

    private final ReviewRepository reviewRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;
    private final FileRepository fileRepository;

    @Value("${com.upload.path}")
    private String uploadPath;


    @Transactional
    public void saveItem(List<MultipartFile> multipartFile, Item item) throws Exception{
        item = itemRepository.save(item);
        if(null != multipartFile) {
            List<SaveFile> fileList = uploadFile(multipartFile, item);
            fileRepository.saveAll(fileList);
        }
    }

    /* 전체 아이템 정보 */
    public List<Item> getAllItem(String cate) {
        List<Item> result = new ArrayList<>();
        result = itemRepository.findListAll(cate);

        return result;
    }

    /* 최근 추가된 책 조회 */
    public List<Item> getRecentRegisteredItem() {
        List<Item> itemList = new ArrayList<Item>();
        try {
            itemList = itemRepository.findRecentRegisteredItem();
        } catch(Exception e) {
            log.debug("최근 추가된 책 조회 에러 발생 ");
            log.error(e.getMessage());
        }
        return itemList;
    }

    /* 아이템 상세 정보 */
    public ItemDTO findItemInfo(long id) {
        ItemDTO itemById = itemRepository.findItemById(id);
        return itemById;
    }

    @Transactional
    public void deleteItem (List<Long> itemList, List<Long> fileList) {
        try {
            if(null != fileList && 0 < fileList.size()) {
                List<SaveFile> deleteFileList = fileRepository.findAllById(fileList);
                deleteFileList.forEach(file -> {
                    try {
                        String srcFileName = URLDecoder.decode(file.getStoredFileName(), "UTF-8");
                        File deleteFile = new File(uploadPath + File.separator + srcFileName);
                        boolean result = deleteFile.delete();
                        if(!result) { throw new BusinessException(ErrorCode.FILE_DELETE_ERROR, "파일 삭제 실패"); }
                    } catch (UnsupportedEncodingException e) {
                        log.error("파일명 decode 에러 발생");
                    } catch (BusinessException e) {
                        log.error("파일 삭제 실패");
                    }
                });
                fileRepository.deleteAllByIdInBatch(fileList);
            }

            if(null != itemList && 0 < itemList.size()) {
                itemRepository.deleteAllByIdInBatch(itemList);
            }
        } catch(Exception e) {
            log.error("상품 삭제 중 에러 발생");
        }
    }

    /* 파일 저장  */
    @Transactional
    public List<SaveFile> uploadFile(List<MultipartFile> multipartFile, Item item) throws Exception {

        List<SaveFile> fileList = new ArrayList<>();
        // 파일명을 업로드 한 날짜로 변환하여 저장
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter =
                DateTimeFormatter.ofPattern("yyyyMMdd");
        String current_date = now.format(dateTimeFormatter);

        // 프로젝트 디렉터리 내의 저장을 위한 절대 경로 설정
        // 경로 구분자 File.separator 사용
        String absolutePath = new File(uploadPath).getCanonicalPath(); //+ File.separator + File.separator;
        File newFile = new File(absolutePath);
        if (!newFile.exists()) {
            boolean wasSuccessful = newFile.mkdirs();
            if (!wasSuccessful) { log.error("file: was not successful"); }
        }

        // 다중 파일 처리
        for (MultipartFile file : multipartFile) {
            // 파일의 확장자 추출
            String originalFileExtension = "";
            String contentType = file.getContentType();

            // 확장자명이 존재할 때
            if (ObjectUtils.isEmpty(contentType)) {
                break;
            } else {
                if (contentType.contains("image/jpeg")) {
                    originalFileExtension = ".jpg";
                } else if (contentType.contains("image/png")) {
                    originalFileExtension = ".png";
                } else {    //다른 확장자면 처리 x
                    break;
                }
            }

            String newFileName = "";
            newFileName = System.nanoTime() + originalFileExtension;

            SaveFile saveFile = SaveFile.builder()
                    .item(item)
                    .originFileName( file.getOriginalFilename() )
                    .storedFileName( newFileName )
                    .fileSize( file.getSize() )
                    .build();

            fileList.add(saveFile);

            newFile = new File(absolutePath + File.separator + newFileName);
            file.transferTo(newFile);

            newFile.setWritable(true);
            newFile.setReadable(true);
        }

        return fileList;
    }

    @Transactional
    public String processPayment(List<PaymentDTO> paymentDtoList) throws BusinessException {
        Member member = memberRepository.findByEmail(paymentDtoList.get(0).getEmail()).orElseThrow(() ->
                new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND, ErrorCode.ACCOUNT_NOT_FOUND.getDescription())
        );
        PaymentMapper paymentMapper = PaymentMapper.INSTANCE;
        List<Payment> paymentList = new ArrayList<Payment>();
        List<Long> cartIds = new ArrayList<Long>();

        for(PaymentDTO paymentDTO : paymentDtoList) {
            paymentDTO.setMemberId(member);
            Payment payment = paymentMapper.toPayment(paymentDTO);
            paymentList.add(payment);
            cartIds.add(paymentDTO.getId());
        }

        cartRepository.updateCartIsPaid(cartIds);   //cart isPaid 값 Y로 변경
        paymentRepository.saveAll(paymentList);     //payment 테이블에 값 추가

        return "success";
    }

    @Transactional
    public String writeReview(ReviewDTO reviewDTO, HttpServletRequest request) {
        String clientIp = getRemoteIP(request);
        Item item = itemRepository.findById(reviewDTO.getItemId()).orElseThrow(IllegalAccessError::new);
        Member member = memberRepository.findByEmail(reviewDTO.getEmail()).orElseThrow(IllegalAccessError::new);
        Review review = new Review(reviewDTO.getContents(), clientIp, member, item);
        try {
            reviewRepository.save(review);
        } catch (Exception e) {
            log.error(e.getMessage());
            return "fail";
        }

        return "success";
    }

    public Page<ReviewDTO> getItemReviews(Pageable pageable, String itemId) {
        Page<ReviewDTO> reviewList = reviewRepository.findReviewList(pageable, itemId);
        return reviewList;
    }

    public static String getRemoteIP(HttpServletRequest request){
        String ip = request.getHeader("X-FORWARDED-FOR");

        //proxy 환경일 경우
        if (ip == null || ip.length() == 0) {
            ip = request.getHeader("Proxy-Client-IP");
        }

        //웹로직 서버일 경우
        if (ip == null || ip.length() == 0) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }

        if (ip == null || ip.length() == 0) {
            ip = request.getRemoteAddr() ;
        }

        return ip;
    }

}

