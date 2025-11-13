import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Search, Crown, User, Edit, Refresh } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole } from "../store/slices/authSlice";

const UsersManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.auth);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleConfirmRoleChange = () => {
    if (selectedUser) {
      const newRole = selectedUser.role === "admin" ? "user" : "admin";
      dispatch(updateUserRole({ userId: selectedUser._id, role: newRole }));
      setRoleDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Users Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage user roles and permissions
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh size={20} />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <Search size={20} color="#64748b" style={{ marginRight: 8 }} />
            ),
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#42B587" }}>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  User
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Joined Date
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "1rem", color: "#ffff" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography fontWeight="600">{user.name}</Typography>
                          {user._id === currentUser._id && (
                            <Chip
                              label="You"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          user.role === "admin" ? (
                            <Crown size={14} />
                          ) : (
                            <User size={14} />
                          )
                        }
                        label={user.role === "admin" ? "Administrator" : "User"}
                        color={user.role === "admin" ? "primary" : "default"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRoleChange(user)}
                        disabled={user._id === currentUser._id || isLoading}
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            backgroundColor: "primary.light",
                            color: "white",
                          },
                          "&:disabled": {
                            color: "text.disabled",
                          },
                        }}
                      >
                        <Edit size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Role Change Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Change role for <strong>{selectedUser.name}</strong> (
                {selectedUser.email})
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedUser.role === "admin"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        role: e.target.checked ? "admin" : "user",
                      })
                    }
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {selectedUser.role === "admin" ? (
                      <Crown size={16} />
                    ) : (
                      <User size={16} />
                    )}
                    <span>
                      {selectedUser.role === "admin" ? "Administrator" : "User"}
                    </span>
                  </Box>
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmRoleChange}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Update Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
