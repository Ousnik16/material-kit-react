import { Routes, Route, Navigate } from 'react-router-dom';

import { Fab } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub'; 
import { ThemeProvider } from 'src/theme/theme-provider'; 

import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';

const App = () => (
  <ThemeProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <GitHubIcon />
    </Fab>
  </ThemeProvider>
);

export default App;
