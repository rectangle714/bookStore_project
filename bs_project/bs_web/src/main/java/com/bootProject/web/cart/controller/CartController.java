package com.bootProject.web.cart.controller;

import com.bootProject.web.cart.dto.CartDTO;
import com.bootProject.web.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/save")
    public ResponseEntity<String> saveCart(@RequestBody CartDTO cartDTO) throws Exception {
        cartService.insertCart(cartDTO);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/selectList")
    public ResponseEntity<Page<CartDTO>> getCartList(@PageableDefault(page = 0, size = 5) Pageable pageable,
                                                        @RequestParam String email) throws Exception {
        Page<CartDTO> cartPage = cartService.selectCartPage(pageable, email);
        return ResponseEntity.ok(cartPage);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteCart(@RequestBody Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/countQuantity")
    public ResponseEntity<String> countQuantity(@RequestParam String flag, @RequestParam Long cartId) {
        cartService.modifyCartQuantity(flag, cartId);
        return ResponseEntity.ok("success");
    }

}
