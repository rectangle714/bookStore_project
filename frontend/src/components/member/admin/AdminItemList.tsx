import { useAppDispatch } from "store/configureStore";
import { useState, useEffect } from 'react';
import { allItemInfo, deleteItem } from 'store/modules/item';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

const AdminItemList = () => {
    const [rows, setRows] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const dispatch = useAppDispatch();

    const rowData = async () => {
        const result = await dispatch(allItemInfo());
        if(result.payload != undefined) {
            setRows(result.payload);
        }
    }

    const onRowsSelectionHandler = (ids:any) => {
      setSelectedRows(ids.map((id:any) => rows.find((row) => row.id === id)));
    };

    const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      id: false
    });
    
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70, hideable: true},
        { field: 'title', headerName: '제목', width: 150 },
        { field: 'contents', headerName: '내용', width: 150 },
        { 
            field: 'registerDate',
            headerName: '등록날짜', 
            width: 200,
            type: 'dateTime',
            valueGetter: ({ value }) => value && new Date(value),
        },
        { 
            field: 'updateDate', 
            headerName: '수정날짜', 
            width: 200,
            type: 'dateTime',
            valueGetter: ({ value }) => value && new Date(value),
        },
        { 
            field: 'fileList', 
            headerName: '이미지', 
            width: 150,
            renderCell: (params) => {
                if(params.value[0] != undefined && params.value[0].storedFileName != '') {
                    return (
                      <>
                        <img 
                        src={process.env.REACT_APP_FILE_URL + params.value[0].storedFileName}
                        style={{ width:40, height:40}}/>
                      </>
                    );
                }
              }
        },
    ];

    const deleteItems = async() => {
        if(selectedRows.length <= 0) {
            alert('삭제할 상품을 선택해주세요.');
        } else {
            let param:any = {};
            let itemIdList:any = [];
            let fileIdList:any = [];
            selectedRows.forEach(function(item, idx) {
                console.log(idx, item);
                itemIdList.push(item.id);
                if(item.fileList != null && item.fileList[0] != undefined) {
                    fileIdList.push(item.fileList[0].file_id);
                }
            });
            param.itemList = itemIdList;
            param.fileList = fileIdList;
            console.log('param ',param);

            const result:any = await dispatch(deleteItem(param));
            if(result != undefined && result.payload == 200){
                alert('선택한 상품이 삭제 되었습니다.');
                rowData();
            }
        }
    }

    useEffect(() => {
        rowData();
    },[]);

    return (
        <>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                  columnVisibilityModel={columnVisibilityModel}
                  onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                  getRowId={(row) => row.id}
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
            </div>
            <div style={{marginTop:'20px', textAlign:'right'}}>
                <Button style={{width: '10%', height:'50px'}} color='primary' variant='contained' onClick={deleteItems}>삭제</Button>
            </div>
        </>
    )
}

export default AdminItemList;