import { Fragment, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface NavInfo {
  name: string;
  path: string;
}

type NavItem = NavInfo & {
  subs: NavInfo[];
};

export interface SidebarProps {
  navs: NavItem[];
}

const Sidebar = ({ navs }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentNavSubOpen = (path: string, subs: NavInfo[]) =>
    subs.some((s) => `${path}${s.path}` === location.pathname);

  const getOpenedNav = (): string => {
    const nav = navs.find((n) => isCurrentNavSubOpen(n.path, n.subs));

    return nav ? nav.path : navs.length ? navs[0].path : '';
  };

  const [open, setOpen] = useState(getOpenedNav());
  const isCurrentNav = (path: string) => open === path;

  const handleOpenNavGroup = (path: string) => () => {
    setOpen((prev) => (prev !== path ? path : ''));
  };

  const handleGoToNav = (path: string) => () => navigate(path);

  return (
    <List
      sx={{ width: '100%', height: '100%', bgcolor: '#f9f7f4' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader sx={{ position: 'inherit', bgcolor: '#f9f7f4' }} component="div" id="nested-list-subheader">
          Examples
        </ListSubheader>
      }
    >
      {navs.map((n) => (
        <Fragment key={n.path}>
          <ListItemButton
            onClick={handleOpenNavGroup(n.path)}
            selected={!isCurrentNav(n.path) && isCurrentNavSubOpen(n.path, n.subs)}
          >
            <ListItemText primary={n.name} primaryTypographyProps={{ variant: 'body2' }} />
            {isCurrentNav(n.path) ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </ListItemButton>
          <Collapse in={isCurrentNav(n.path)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {n.subs.map((s) => (
                <ListItemButton
                  key={s.path}
                  sx={{ pl: 4 }}
                  onClick={handleGoToNav(`${n.path}${s.path}`)}
                  selected={isCurrentNavSubOpen(n.path, [s])}
                >
                  <ListItemText primary={s.name} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
};

export default Sidebar;
