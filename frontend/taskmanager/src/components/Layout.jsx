import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  Crown,
  LayoutDashboard,
  Settings,
  BarChart3,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const drawerWidth = 280;

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
    handleUserMenuClose();
  };

  const menuItems = [
    { text: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { text: "Analytics", icon: BarChart3, path: "/analytics" },
    { text: "Settings", icon: Settings, path: "/settings" },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              width: "100%",
              maxWidth: 200,
            }}
          >
            <img
              src="/company-logo.svg"
              alt="Company Logo"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: 150,
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 45 }}>
                  <IconComponent
                    size={20}
                    color={isActive ? "white" : theme.palette.text.secondary}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "1rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "white",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 45 }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: "1rem",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </IconButton>
            )}
            <Typography variant="h5" component="div" fontWeight="bold">
              Task Manager
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <Button
              color="inherit"
              onClick={handleUserMenuOpen}
              startIcon={<User size={18} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {user?.name}
            </Button>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <MenuItem sx={{ pointerEvents: "none", opacity: 0.7 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <ListItemIcon>
                  <LogOut size={18} color={theme.palette.error.main} />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
