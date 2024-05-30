import { useLocation } from "react-router";
import 'styles/layout/sideBar.css';
import BookIcon from '@mui/icons-material/Book';
import styled from 'styled-components';
import { Navigation } from 'react-minimal-side-navigation';

const Bar = styled.div`
  top: 250px;
  width: 12.5rem;
  height: 100%;
  left: 5.5rem;
  // position: fixed;
  padding-top: 15rem;
  // transform: translate(1em, 12rem);
`;

const SideBar = ({setTitleValue}:any) => {
  let {state} = useLocation();
  state == null ? setTitleValue('베스트') : setTitleValue(state.title);

  const setActiveValue = (itemId:string) => {
    state.itemId != null ? state.itemId = itemId : state.itemId = '/BEST';
    switch (itemId) {
      case '/BEST':
        state.title = '베스트';
        setTitleValue(()=>'베스트');
        break;
      case '/FICTION':
        state.title = '소설';
        setTitleValue(()=>'소설');
        break;
      case '/SELF_IMPROVEMENT':
        state.title = '자기계발';
        setTitleValue(()=>'자기계발');
        break;
      case '/HUMANITIES':
        state.title = '인문';
        setTitleValue(()=>'인문');
        break;
      case '/ESSAY':
        state.title = '시/에세이';
        setTitleValue(()=>'시/에세이');
        break;
    }
  }

  return (
    <>
      <Bar>
        <Navigation
              activeItemId={state == null ? '/BEST' : state.itemId}
              onSelect={(itemId) => {
                setActiveValue(itemId.itemId);
              }}
              items={[
                {
                  title: '베스트',
                  itemId: '/BEST',
                  subNav : [],
                  elemBefore: () => <BookIcon name="inbox" style={{ fontSize: '1.2rem' }}/>,
                },
                {
                  title: '소설',
                  itemId: '/FICTION',
                  elemBefore: () => <BookIcon style={{ fontSize: '1.2rem' }}/>,
                },
                {
                  title: '자기계발',
                  itemId: '/SELF_IMPROVEMENT',
                  elemBefore: () => <BookIcon name="inbox" style={{ fontSize: '1.2rem' }}/>,
                },
                {
                  title: '인문',
                  itemId: '/HUMANITIES',
                  elemBefore: () => <BookIcon name="inbox" style={{ fontSize: '1.2rem' }}/>,
                },
                {
                  title: '시/에세이',
                  itemId: '/ESSAY',
                  elemBefore: () => <BookIcon name="inbox" style={{ fontSize: '1.2rem' }}/>,
                }
              ]}
            />
      </Bar>
    </>
  );
};

export default SideBar;