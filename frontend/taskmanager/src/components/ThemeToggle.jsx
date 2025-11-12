import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          color: "text.primary",
        }}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
