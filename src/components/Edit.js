import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import "./edit.css";
import {
  FormControl,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import { height } from "@mui/system";

export default function Edit({
  setOpen,
  open,
  currentPosts,
  selectedId,
  data,
  setData,
  setSearchAll,
}) {
  //   const [open, setOpen] = useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  const dataToEdit = currentPosts.find((el) => el.id === selectedId);
  console.log(dataToEdit);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    setFormData({
      name: dataToEdit.name,
      email: dataToEdit.email,
      role: dataToEdit.role,
    });
  }, [selectedId]);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  }

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: dataToEdit.name,
      email: dataToEdit.email,
      role: dataToEdit.role,
    });
  };

  function submitData(id) {
    if (formData.name === "") {
      alert("name cannot be empty");
      setOpen(false);
      return;
    }
    if (formData.email === "") {
      alert("email cannot be empty");
      setOpen(false);
      return;
    }
    setOpen(false);
    setSearchAll(
      data.map((item) => {
        if (item.id === id) {
          return { ...item, ...formData };
        }
        return item;
      })
    );
    setData(
      data.map((item) => {
        if (item.id === id) {
          return { ...item, ...formData };
        }
        return item;
      })
    );
  }

  console.log(selectedId);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit Data</DialogTitle>
        <DialogContent dividers>
          <FormControl>
            <Stack spacing={1}>
              <TextField
                id="name"
                label="name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={onChange}
              />
              <TextField
                id="email"
                label="email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={onChange}
              />
              <select
                className="select-role"
                onChange={onChange}
                name="role"
                value={formData.role}
              >
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
            </Stack>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => submitData(selectedId)} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
