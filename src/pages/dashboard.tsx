import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar, CssBaseline } from '@mui/material';
import { Person as StudentsIcon, Logout as LogoutIcon } from '@mui/icons-material';

import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

import StudentsPage from './studentspage';

const drawerWidth = 200; 

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed: ', error);
      });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate('/dashboard/students')}>
            <ListItemIcon><StudentsIcon /></ListItemIcon>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`,
          maxWidth: `calc(100% - ${drawerWidth}px)`, 
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="students" element={<StudentsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
