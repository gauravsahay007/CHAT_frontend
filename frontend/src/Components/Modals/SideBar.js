import React from 'react';
import { useState ,useEffect} from 'react';
import { Grid, Typography, TextField, Stack, CircularProgress, Avatar, IconButton, Tooltip, Popover, MenuItem, ListItemIcon } from '@mui/material';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { Logout } from '@mui/icons-material';
import { SearchUsers } from '../Helper';
import { ChatState } from '../../main/chatProvider';
import UserListItem from '../Avatar/UserListItem';

import { AccessChats } from '../Helper';
import { useNavigate } from 'react-router-dom';
export default function SideBar() {
  const [state, setState] = React.useState({
    left: false,
  });
  const [fetch, setFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user, setUser } = ChatState();
  const [open, setOpen] = useState(false);
  const { selectedChat, setSelectedChat } = ChatState();
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(true);
    setState({ ...state, [anchor]: open });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [fetch]);

  const handleSearch = (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      SearchUsers(user, query).then((response, err) => {
        setSearchResults(response);
        setFetch(!fetch);
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const onClick = (receiver) => {
    try {
      AccessChats(user, receiver._id, receiver.name).then((response) => {
        setSelectedChat(response[0]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const Search = () => {
    return (
      <Grid item xs={12} sx={{ ml: "5px", mb: "10px", mt: "1px" }}>
        <TextField
          size="small"
          id="group name"
          label="Search by name or email"
          sx={{ color: "blue" }}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <Button
          variant="contained"
          sx={[
            { ml: "4px", mt: "2px", bgcolor: "#2C3E50", mr: "5px" },
            {
              "&:hover": {
                bgcolor: "white",
                color: "#2C3E50",
              },
            },
          ]}
          onClick={() => {
            handleSearch(search);
          }}
        >
          Search
        </Button>

        <Stack direction="row" spacing={10}>
          {loading ? (
            <div>
              <CircularProgress size="25px" sx={{ mt: "12px" }} />
            </div>
          ) : (
            <div></div>
          )}
        </Stack>

        {loading ? (
          <div></div>
        ) : (
          searchResults
            ?.slice(0, 4)
            .map((user) => (
              <Box key={user._id} sx={{ mr: "10px" }}>
                <UserListItem key={user._id} user={user} handleFunction={() => onClick(user)} />
              </Box>
            ))
        )}
      </Grid>
    );
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <React.Fragment>
        <Button onClick={toggleDrawer()}>
          <SearchIcon sx={{ color: "#32465A" }} />
        </Button>

        {open ? (
          <Drawer open={open} onClose={handleClose}>
            <Typography align="center" sx={{ mr: "10px", mt: "5px", fontSize: "1.5rem", color: "#2C3E50" }}>
              Search Users
            </Typography>
            <Box sx={{ border: "1px solid #2C3E50", mb: "5px" }}></Box>
            {Search()}
          </Drawer>
        ) : (
          <></>
        )}
      </React.Fragment>

      <Tooltip title="My Profile">
        <IconButton onClick={handleClick}>
          <Avatar sx={{ width: "30px", height: "30px" }} src={user.user.pic} />
        </IconButton>
      </Tooltip>
{/* The Popover component in MUI (Material-UI) is a versatile component that helps to display content in a floating container that appears above other elements in the UI. It is often used to create tooltips, dropdown menus, pop-up dialogs, or any other content that needs to be displayed in a separate container */}
<Popover
  id="account-menu"
  open={openMenu}
  anchorEl={anchorEl}
  onClose={handleCloseMenu}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
    <Avatar sx={{ width: '64px', height: '64px', mb: '8px' }} src={user.user.pic} />
    <Typography variant="subtitle1" sx={{ mb: '4px' }}>{user.user.name}</Typography>
    <Typography variant="body2" sx={{ mb: '8px' }}>{user.user.email}</Typography>
    <MenuItem sx={[{bgcolor:"#DE4839",color:"white", borderRadius:"4px"},{
      "&:hover":{
        bgcolor:"#DE4839",color:"white"
      }
    }]} onClick={userLogout}>
      <ListItemIcon sx={{color:"white"}}>
        <Logout fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  </Box>
</Popover>

    </div>
  );
}
