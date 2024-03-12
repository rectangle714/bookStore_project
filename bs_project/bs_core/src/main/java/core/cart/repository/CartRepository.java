package core.cart.repository;

import core.cart.dto.CartDTO;
import core.cart.entity.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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
