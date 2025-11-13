import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "../store/slices/taskSlice";
import { BookOpen, Calendar, CheckCircle, Clock } from "lucide-react";

const TaskForm = ({ open, onClose, task }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    }
    setFormErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (task) {
        dispatch(updateTask({ id: task._id, taskData: formData }))
          .unwrap()
          .then(() => {
            onClose();
          });
      } else {
        dispatch(createTask(formData))
          .unwrap()
          .then(() => {
            onClose();
          });
      }
    }
  };

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <BookOpen size={24} />
          <Typography variant="h6" component="span">
            {task ? "Edit Task" : "Create New Task"}
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="description"
            label="Task Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="pending">
                <Box display="flex" alignItems="center" gap={1}>
                  <Clock size={16} />
                  <span>Pending</span>
                </Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle size={16} />
                  <span>Completed</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {task && (
            <Box mt={2} p={1} bgcolor="background.default" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={{ borderRadius: 2, textTransform: "capitalize", color: "red" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: 2,
              backgroundColor: "#3B7067",
              textTransform: "capitalize",
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : task ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
