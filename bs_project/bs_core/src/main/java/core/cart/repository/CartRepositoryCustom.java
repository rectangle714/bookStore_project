package core.cart.repository;

import core.cart.dto.CartDTO;
import core.cart.entity.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CartRepositoryCustom {
    public List<CartDTO> selectCartList(String email);
    public Cart selectByItemIdAndMemberId(Long itemId, Long memberId);
    public Page<CartDTO> selectCartPage(Pageable pageable, String email);
    public void updateCartIsPaid(List<Long> ids);
}
