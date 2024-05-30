import { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { Stack } from '@mui/material';
import 'styles/common/Pagination.css';

export interface Page {
    totalDataCount: number;
    totalPageCount: number;
}

interface pageProps {
    pageData?: Page;
    getDataList: (currentPage:number) => void;
}

export default function PaginationForm({pageData, getDataList}:pageProps) {

    const [page, setPage] = useState(1);
    const handlePage = (event:any) => {
        const nowPageInt = event;
        setPage(nowPageInt);
        getDataList(nowPageInt-1);
    }
    
    useEffect(() => {

    }, [page]);

    return(
        <>
            <Stack className={'pagingDiv'} justifyContent="center" sx={{float:'right', position:'relative', left:'-45%' }}>
                <Pagination
                    activePage={page}
                    itemsCountPerPage={5}
                    totalItemsCount={pageData?.totalDataCount!}
                    pageRangeDisplayed={5}
                    prevPageText={"<"}
                    nextPageText={">"}
                    onChange={e =>handlePage(e)}
                />
            </Stack>
        </>
    )
}