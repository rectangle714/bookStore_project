import { Container } from "@mui/material";
import Cart from "components/cart/Cart";

const CartPage = () => {
    return(
        <>
            <Container maxWidth="lg" sx={{padding:'80px', minHeight:'700px'}}>
                <Cart></Cart>
            </Container>
        </>
    )
}

export default CartPage;