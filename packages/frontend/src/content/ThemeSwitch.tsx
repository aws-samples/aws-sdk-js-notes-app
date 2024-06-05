import React, { useState } from "react";
import { useThemeContext } from "../hooks/useThemeContext";
import Form from "react-bootstrap/Form";


export const ThemeSwitch = () => {
  const { darkMode, setDarkMode } = useThemeContext();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Form style={{paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
      <div
        style={{color: darkMode ? 'white' : ''}}
      >Light Mode 🌞</div>
      <Form.Check // prettier-ignore
        type="switch"
        onClick={toggleTheme}
        id="custom-switch"
        defaultChecked={darkMode}
        style={{color: darkMode ? 'white' : '', marginLeft: '0.5rem'}}
        label="Dark Mode 🌛"
      />
    </Form>
  );
}