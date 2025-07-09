import { useAppDispatch } from "store/configureStore";
import { useState, useEffect } from "react";
import { allItemInfo, deleteItem } from "store/modules/item";
import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

const AdminItemList = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  const rowData = async () => {
    const result = await dispatch(allItemInfo());
    if (result.payload !== undefined) {
      setRows(result.payload);
    }
  };

  const onRowsSelectionHandler = (ids: any) => {
    setSelectedRows(ids.map((id: any) => rows.find((row) => row.id === id)));
  };

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({ id: false });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "제목", width: 180 },
    { field: "contents", headerName: "내용", width: 200 },
    {
      field: "registerDate",
      headerName: "등록날짜",
      width: 180,
      type: "dateTime",
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "updateDate",
      headerName: "수정날짜",
      width: 180,
      type: "dateTime",
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "fileList",
      headerName: "이미지",
      width: 100,
      renderCell: (params) => {
        const file = params.value?.[0];
        if (file && file.storedFileName) {
          return (
            <img
              src={process.env.REACT_APP_FILE_URL + file.storedFileName}
              alt="상품 이미지"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          );
        }
        return (
          <Typography variant="caption" color="textSecondary">
            없음
          </Typography>
        );
      },
    },
  ];

  const deleteItems = async () => {
    if (selectedRows.length <= 0) {
      alert("삭제할 상품을 선택해주세요.");
    } else {
      const itemIdList: any[] = [];
      const fileIdList: any[] = [];

      selectedRows.forEach((item) => {
        itemIdList.push(item.id);
        if (item.fileList?.[0]) {
          fileIdList.push(item.fileList[0].file_id);
        }
      });

      const param = {
        itemList: itemIdList,
        fileList: fileIdList,
      };

      const result: any = await dispatch(deleteItem(param));
      if (result?.payload === 200) {
        alert("선택한 상품이 삭제되었습니다.");
        rowData(); // 삭제 후 다시 조회
      }
    }
  };

  useEffect(() => {
    rowData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          상품 목록
        </Typography>

        <Box sx={{ height: 600, width: "100%", mt: 2 }}>
          <DataGrid
            columnVisibilityModel={columnVisibilityModel}
            onRowSelectionModelChange={onRowsSelectionHandler}
            getRowId={(row) => row.id}
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
            size="large"
            sx={{ width: 140, height: 45 }}
            onClick={deleteItems}
          >
            삭제
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AdminItemList;
