package com.bootProject.web.cart.repository;

import com.bootProject.web.cart.dto.CartDTO;
import com.bootProject.web.cart.entity.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long>, CartRepositoryCustom {

    @Override
    public List<CartDTO> selectCartList(String email);

    @Override
    public Cart selectByItemIdAndMemberId(Long itemId, Long memberId);

    @Override
    public Page<CartDTO> selectCartPage(Pageable pageable, String email);

    @Override
    public void updateCartIsPaid(List<Long> ids);

}
