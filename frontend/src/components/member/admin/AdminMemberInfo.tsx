import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useAppDispatch } from "../../../store/configureStore";
import { allUserInfo } from "../../../store/modules/user"
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';

const AdminMemberInfo = () => {
  const [rows, setRows] = useState([]);
  const dispatch = useAppDispatch();

  const rowData = async () => {
    const result = await dispatch(allUserInfo());
    if (result.payload != undefined) {
      setRows(result.payload);
    }
  }

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({ id: false });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: '이메일', width: 180 },
    { field: 'nickname', headerName: '닉네임', width: 130 },
    {
      field: 'role',
      headerName: '권한',
      sortable: false,
      width: 120,
      valueGetter: ({ value }) => value === 'USER' ? '사용자' : '관리자',
    },
    {
      field: 'registerDate',
      headerName: '등록일',
      width: 180,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'updateDate',
      headerName: '수정일',
      width: 180,
      type: 'dateTime',
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'socialType',
      headerName: '가입경로',
      width: 130
    }
  ];

  useEffect(() => {
    rowData();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          👥 회원 정보 관리
        </Typography>

        <Box sx={{ height: 600, width: '100%', mt: 2 }}>
          <DataGrid
            columnVisibilityModel={columnVisibilityModel}
            getRowId={(row) => row.memberId}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            color="error"
            sx={{ height: '45px', minWidth: '120px' }}
          >
            선택 삭제
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AdminMemberInfo;
