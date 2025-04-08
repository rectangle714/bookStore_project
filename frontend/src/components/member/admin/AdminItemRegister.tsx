import axios from "axios";
import { useEffect, useRef, useState } from "react";
import store from "store/configureStore";
import { Item, registerItem } from "store/modules/item";
import LoadingBar from "components/common/LoadingBar";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Stack,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { Textarea } from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const AdminItemRegister = () => {
  const item = useRef<Item>({
    title: "",
    contents: "",
    price: 0,
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [contents, setContents] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const onChangePrice = (e: any) => {
    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
    const intValue = parseInt(onlyNumber.replace(/,/g, ""), 10);
    const addComma = isNaN(intValue) ? 0 : intValue.toLocaleString();
    e.target.value = addComma;
    setPriceValue(intValue);
  };

  const onSelectedFiles = async (e: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    const selectedFile = e.currentTarget.files[0];
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
  };

  const itemSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const enteredTitle = titleInputRef.current!.value;
    const enteredContents = contents;

    if (!enteredTitle) return alert("제목을 입력해주세요");
    if (!enteredContents) return alert("내용을 입력해주세요");

    const formData = new FormData();
    formData.append("title", enteredTitle);
    formData.append("contents", enteredContents);
    formData.append("price", priceValue.toString());
    formData.append("category", categoryValue);
    if (file) formData.append("file", file);

    setIsLoading(true);
    const result = await store.dispatch(registerItem(formData));
    setIsLoading(false);

    if (result.payload === "success") {
      alert("상품을 등록했습니다.");
      window.location.reload();
    } else {
      alert("상품 입력 에러가 발생했습니다.");
    }
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/common/category")
      .then((response) => setCategories(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: 1000, margin: "50px auto" }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📦 상품 등록
          </Typography>

          <Box
            component="form"
            encType="multipart/form-data"
            onSubmit={itemSubmitHandler}
          >
            <Grid container spacing={4} mt={2}>
              {/* 왼쪽: 이미지 미리보기 */}
              <Grid item xs={12} md={5}>
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 200,
                      height: 300,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {imageSrc ? (
                      <Box
                        component="img"
                        src={imageSrc}
                        alt="미리보기"
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        이미지 없음
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    color="success"
                    fullWidth
                  >
                    이미지 업로드
                    <VisuallyHiddenInput
                      accept="image/*"
                      type="file"
                      onChange={onSelectedFiles}
                    />
                  </Button>
                </Stack>
              </Grid>

              {/* 오른쪽: 입력 폼 */}
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <TextField
                    label="상품명"
                    inputRef={titleInputRef}
                    fullWidth
                  />

                  <TextField
                    label="가격"
                    defaultValue={0}
                    onChange={onChangePrice}
                    inputProps={{ maxLength: 8 }}
                    fullWidth
                  />

                  <FormControl fullWidth>
                    <InputLabel id="category-label">카테고리</InputLabel>
                    <Select
                      labelId="category-label"
                      value={categoryValue}
                      label="카테고리"
                      onChange={(e) => setCategoryValue(e.target.value)}
                    >
                      <MenuItem value={"00"}>선택</MenuItem>
                      {categories.map((category: any) => (
                        <MenuItem key={category.code} value={category.code}>
                          {category.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Textarea
                    minRows={5}
                    placeholder="상품 설명을 입력해주세요."
                    onChange={(e) => setContents(e.target.value)}
                    value={contents}
                    sx={{ width: "100%" }}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={5}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ width: 200, height: 55 }}
              >
                상품 등록
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      <LoadingBar isOpen={isLoading} />
    </>
  );
};

export default AdminItemRegister;
