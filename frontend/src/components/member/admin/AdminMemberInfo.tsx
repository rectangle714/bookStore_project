import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useAppDispatch } from "../../../store/configureStore";
import { allUserInfo } from "../../../store/modules/user"
import { Button } from '@mui/material';

const AdminMemberInfo = () => {
  const [rows, setRows] = useState([]);
  const dispatch = useAppDispatch();

  const rowData = async () => {
    const result = await dispatch(allUserInfo());
    if(result.payload != undefined) {
      setRows(result.payload);
    }
  }

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({ id: false });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: '이메일', width: 130 },
    { field: 'nickname', headerName: '닉네임', width: 130 },
    {
      field: 'role',
      headerName: '권한',
      sortable: false,
      width: 130,
      valueGetter: ({value}) => value=='USER' ? '사용자' : '관리자',
    },
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
      field: 'socialType',
      headerName: '가입경로',
      width: 120
    }
  ];

  useEffect(() => {
    rowData();
  },[]);

return (
  <>
    <div style={{ height: 600, width: '100%', marginBottom:'50px' }}>
      <DataGrid
        columnVisibilityModel={columnVisibilityModel}
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
      <div style={{marginTop:'20px', textAlign:'right'}}>
        <Button style={{width: '10%', height:'50px'}} color='primary' variant='contained' >삭제</Button>
      </div>
    </div>
  </>
)
}

export default AdminMemberInfo;