import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import store from "store/configureStore";
import { Item, registerItem } from "store/modules/item";
import LoadingBar from "components/common/LoadingBar";
import { Button, Select, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Textarea } from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MenuItem from '@mui/material/MenuItem';

const AdminItemRegister = () => {
  const item = useRef<Item>({ title: "", contents: "", price: 0, category: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc]: any = useState(null);
  const [file, setFile] = useState<File>();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [contents, setContents] = useState('');
  const [priceValue, setPriceValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState('');
  const [categories, setCategories] = useState<any>([]);

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
    const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
    const intValue = parseInt(onlyNumber.replace(/,/g, ''), 10);
    const addComma = isNaN(intValue) ? 0 : intValue.toLocaleString();
    e.target.value = addComma;
    setPriceValue(intValue);
  }

  const onSelectedFiles = async (e: any) => {
    let reader = new FileReader();

    reader.onload = function (e) {
      setImageSrc(e.target?.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setFile(e.currentTarget.files[0]);
  };

  const itemSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const enteredTitle = titleInputRef.current!.value;
    const enteredContents = contents;

    if (enteredTitle == "" || enteredTitle == undefined) {
      alert("제목을 입력해주세요");
      return;
    }

    if (enteredContents == "" || enteredContents == undefined) {
      alert("내용을 입력해주세요");
      return;
    }

    const formData = new FormData();
    formData.append("title", enteredTitle);
    formData.append("contents", enteredContents);
    formData.append("price", priceValue.toString());
    formData.append("category", categoryValue);
    if (file !== undefined) {
      formData.append("file", file);
    }
    setIsLoading(true);
    const result = await store.dispatch(registerItem(formData));
    if (result.payload === "success") {
      alert("상품을 등록했습니다.");
      setIsLoading(false);
      window.location.reload();
    } else {
      alert('상품 입력 에러가 발생했습니다.');
    }
  };

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/common/category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  return (
    <>
      <form encType="multipart/form/data">
        <div style={{ textAlign: "center", borderBottom: "solid 3px black", borderTop:"solid 3px black" }}>
          <table
            style={{
              width: "490px",
              marginLeft: "auto",
              marginRight: "auto",
              borderCollapse: "separate",
              borderSpacing: "10px 20px",
            }}
          >
            <colgroup>
              <col width={"30%"} />
              <col width={"*"} />
              <col width={"30%"} />
            </colgroup>
            <tbody>
              <tr>
                <td>상품명</td>
                <td colSpan={2}>
                  <TextField
                    variant="outlined"
                    sx={{ width: "100%" }}
                    id='title'
                    inputRef={titleInputRef}
                  />
                </td>
              </tr>
              <tr>
                <td>가격</td>
                <td colSpan={2} style={{textAlign:'left'}}>
                  <TextField
                    variant="outlined"
                    defaultValue={0}
                    onChange={onChangePrice}
                    inputProps={{maxLength: 8}}
                    sx={{ width: "50%" }}
                    id='price'
                  />
                </td>
              </tr>
              <tr>
                <td>분류</td>
                <td colSpan={2} style={{textAlign:'left'}}>
                  <Select
                    variant="outlined"
                    sx={{ width: "50%" }}
                    id='category'
                    defaultValue={'00'}
                    onChange={e => setCategoryValue(e.target.value)}
                  >
                    <MenuItem value={'00'}>선택</MenuItem>
                    {
                      categories.map((category:any) => (
                        <MenuItem key={category.code} value={category.code}>{category.title}</MenuItem>
                      ))
                    }
                  </Select>
                </td>
              </tr>
              <tr>
                <td>내용</td>
                <td colSpan={2}>
                  <Textarea
                    onChange={(e) => setContents(e.target.value)}
                    sx={{ width: "100%" }}
                    minRows={3}
                    maxRows={5}
                    name='contents'
                  />
                </td>
              </tr>
              <tr>
                <td>이미지</td>
                <td>
                  <img src={imageSrc} style={{ height:'200px', width:'200px', objectFit:'scale-down', objectPosition: 'center center'}}/>
                </td>
                <td>
                  <Button color='success' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload
                    <VisuallyHiddenInput 
                      accept="image/*" 
                      multiple type="file"
                      onChange={e => onSelectedFiles(e)}
                    />
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <Button  style={{width: '50%', height:'50px', marginTop:'28px'}}  color='success' variant='contained' size="large" onClick={itemSubmitHandler}>등록</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ paddingTop: 10 }}>
        </div>
      </form>
      <LoadingBar isOpen={ isLoading } />
    </>
  );
};

export default AdminItemRegister;
