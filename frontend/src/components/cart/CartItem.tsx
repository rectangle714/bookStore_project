import axios from 'axios';
import React, { useState } from 'react';
import { IconButton, ListItemIcon, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Book } from './Cart';

interface CartItemProps {
  book: Book;
  onRemove: (itemId: number) => void;
  renderTotalPrice: (flag:any, price:number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ book, onRemove, renderTotalPrice }) => {
  const [bookPrice, setBookPrice] = useState(book.price! * book.quantity);
  const [itemQuantity, setItemQuantity] = useState(book.quantity);

  const onCountQuantity = async (flag:any) => {
    const URL = process.env.REACT_APP_API_URL + '/cart/countQuantity';
    const param = {
      flag : flag,
      cartId : book.cartId
    }

    if(flag == 'increse') {
      axios.post(URL, null, {params:param});
      setItemQuantity(itemQuantity + 1);
      setBookPrice((itemQuantity+1) * book.price!);
      renderTotalPrice(flag, book.price!);
    } else if(flag == 'decrese') {
      if(itemQuantity > 1) {
        axios.post(URL, null, {params:param});
        setItemQuantity(itemQuantity - 1);
        setBookPrice((itemQuantity-1) * book.price!);
        renderTotalPrice(flag, book.price!);
      }
    }
  }

  return (
    <tr style={{borderBottom:'1px solid black'}}>
      <td style={{width:'80px', height:'150px'}}>
        <ListItemIcon>
          <img src={book.storedFileName != undefined ?process.env.REACT_APP_FILE_URL + book.storedFileName : ''} 
            style={{ width:'82px', height:'121px', cursor:"pointer" }}alt='logo image'/>
        </ListItemIcon>
      </td>
      <td style={{width:'500px', textAlign:'left'}}>
        <div>
          <div style={{fontWeight:'600', paddingLeft:'10px'}}>{book.title}</div>
          <div style={{fontWeight:'500', paddingLeft:'20px'}}>{`${book.price?.toLocaleString()}원`}</div>
        </div>
      </td>
      <td>
        <div style={{textAlign:'right'}}>
          <IconButton onClick={()=> onRemove(book.cartId)}>
            <ClearIcon style={{cursor:'pointer'}}/>
          </IconButton>
        </div>
        <div style={{paddingRight:'30px', textAlign:'right'}}>
          <span>{bookPrice?.toLocaleString()}원</span>
        </div>
        <div style={{textAlign:'right', width:'150px'}}>
          <Button onClick={() => onCountQuantity('decrese')}>-</Button>{itemQuantity}<Button onClick={() => onCountQuantity('increse')}>+</Button>
        </div>
      </td>
    </tr>
  );
};

export default CartItem;