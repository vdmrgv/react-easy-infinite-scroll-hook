import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Header from './Header';
import Sidebar, { SidebarProps } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: SidebarProps;
}

const Layout = ({ children, sidebar }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className="App-layout">
        <Box className="App-layout-container" sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={2}>
              <Sidebar {...sidebar} />
            </Grid>
            <Grid item xs={12} md="auto">
              <Paper className="App-layout-paper" elevation={0}>
                {children}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </main>
    </>
  );
};

export default Layout;
