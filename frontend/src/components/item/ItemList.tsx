import SideBar from "components/layout/SideBar";
import { useState } from "react";
import styled from 'styled-components';
import ItemListItem from "./ItemListItem";

const BookList = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin: auto;
  /* margin-left: 10rem; */

  @media only screen and (max-width: 768px) {
    margin-top: 2rem;
    margin-left: 0;
    width: 100%;
  }
`;

const BookListTop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
  margin-bottom: 2rem;
  width: 100%;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #c5cbd3;
    transform: translateY(1rem);
  }

  @media only screen and (max-width: 768px) {
    margin-left: 0.5rem;
  }
`;

const BookCards = styled.div`
  display: flex;
  /* justify-content: space-around; */
  flex-wrap: wrap;
  width: 100%;
  height: 100vh;
  @media only screen and (max-width: 1179px) {
    justify-content: center;
  }
`;

const ItemList = () => {
  const [title, setTitle] = useState<string>('');

  return (
    <>
      <div style={{ width: '100%', height: '100%'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '1170px',
            margin: 'auto',
            height: 'auto'
          }}
        >
          <SideBar setTitleValue={setTitle}/>
          <div style={{ width: '100%', height: '100%', marginTop: '7rem' }}>
            <BookList>
              <BookListTop>
                <p style={{ fontSize: '2rem', color: 'black' }}>{title != null ? title : ''}</p>
              </BookListTop>
              <BookCards>
                <ItemListItem title={title != null ? title : ''}/>
              </BookCards>
            </BookList>
          </div>
        </div>
      </div>
    </>
  )

}

export default ItemList;