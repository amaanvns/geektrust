import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Box,
  Checkbox,
  TextField,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Edit from "./Edit";
import { useState, useEffect } from "react";

const TableUI = () => {
  const [data, setData] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [postPerPage, setpostPerPage] = useState(10);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setselectedId] = useState(null);
  const [checkedId, setCheckedId] = useState([]);
  const [allcheck, setAllcheck] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [searchAll, setSearchAll] = useState([]);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;

  console.log(checkedId);

  async function fetchData() {
    try {
      const res = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setData(res.data);
    } catch (error) {
      alert("something went wrong please reload page");
      console.log(error);
    }
  }

  function onPageChange(event, value) {
    setcurrentPage(value);
  }

  function selectCheck(e) {
    const index = checkedId.indexOf(e.target.value);
    if (index === -1) {
      setCheckedId([...checkedId, e.target.value]);
    } else {
      setCheckedId(checkedId.filter((id) => id !== e.target.value));
    }
  }

  function selectAll() {
    setAllcheck(!allcheck);
    if (allcheck) {
      setCheckedId([]);
    } else {
      if (searchData.length < 1) {
        setCheckedId(currentPosts.map((el) => el.id));
      } else {
        setCheckedId(searchAll.map((el) => el.id));
      }
    }
  }

  function deleteInfo(id) {
    const updatedData = data.filter((item) => item.id !== id);
    setSearchAll(updatedData);
    setData(updatedData);
  }

  function deleteSelected() {
    const newData = data.filter((item) => !checkedId.includes(item.id));
    setData(newData);
    setSearchAll(newData);
    setAllcheck(false);
  }

  function editData(id) {
    setOpen(true);
    setselectedId(id);
  }

  function searchItem(e) {
    setSearchData(e.target.value);
    if (e.target.value !== "") {
      const newPosts = data.filter((item) => {
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setSearchAll(newPosts);
    } else {
      setSearchAll(data);
    }
  }

  useEffect(() => {
    fetchData();
    console.log(currentPosts);
  }, []);

  useEffect(() => {
    setCurrentPosts(data.slice(indexOfFirstPost, indexOfLastPost));
    setLoading(false);
  }, [data, currentPage]);

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>...Loading</h1>
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            sx={{
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <TextField
              id="fullWidth"
              sx={{ width: "99%", alignSelf: "center" }}
              placeholder="Search by name, email or role"
              value={searchData}
              onChange={searchItem}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox checked={allcheck} onChange={selectAll} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(searchData.length < 1 ? currentPosts : searchAll).map(
                    (item) => {
                      return (
                        <TableRow
                          key={item.id}
                          sx={{
                            backgroundColor: checkedId.includes(item.id)
                              ? "#c3c3c3"
                              : "",
                          }}
                        >
                          <TableCell>
                            <Checkbox
                              value={item.id}
                              checked={checkedId.includes(item.id)}
                              onChange={selectCheck}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              onClick={() => editData(item.id)}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                            <Button
                              size="small"
                              onClick={() => deleteInfo(item.id)}
                            >
                              <DeleteOutlineOutlinedIcon
                                fontSize="small"
                                color="error"
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" sx={{ padding: "10px", marginTop: "auto" }}>
              <Button
                variant="contained"
                color="error"
                onClick={deleteSelected}
              >
                Delete Selected
              </Button>
              <Pagination
                count={Math.ceil(data.length / 10)}
                defaultPage={currentPage}
                color="primary"
                sx={{ margin: "auto" }}
                showFirstButton={true}
                showLastButton={true}
                onChange={onPageChange}
              />
            </Box>
          </Box>
          {selectedId && (
            <>
              <Edit
                setOpen={setOpen}
                open={open}
                currentPosts={searchData.length < 1 ? currentPosts : searchAll}
                selectedId={selectedId}
                data={data}
                setData={setData}
                setSearchAll={setSearchAll}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default TableUI;
