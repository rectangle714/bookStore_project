import Container from '@mui/material/Container';
import ItemGrid from '../item/ItemGrid';
import Styls from'../../styles/layout/MainPage.module.css';
import Slider from './Slider';
import { DataGrid } from '@mui/x-data-grid';

const MainPage = () => {

    return (
      <>
        <Slider/>
        <Container fixed className={Styls.container}>
          <div style={{borderBottom:'solid 3px black', height:'60px'}}>
            <span style={{fontWeight: '500', fontSize: '24px', color: 'rgb(51, 51, 51)', lineHeight:'48px'}}>최근 추가된 책</span>
          </div>
          <ItemGrid/>
          <div style={{paddingTop:'60px', borderBottom:'solid 3px black', height:'60px'}}>
            <span style={{fontWeight: '500', fontSize: '24px', color: 'rgb(51, 51, 51)', lineHeight:'48px'}}>게시판</span>
          </div>
          <div style={{ height: 500, width: '80%', paddingTop:'20px', marginLeft:'auto', marginRight:'auto'}}>
            {/* <DataGrid
              slots={{columnHeaders: () => null}}
              rows={[]}
              columns={[]}
              initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5, },
                },
              }}
              pageSizeOptions={[5, 10]}
            /> */}
          </div>
        </Container>
      </>
    )
}

export default MainPage;