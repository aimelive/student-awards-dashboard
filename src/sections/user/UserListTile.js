import {
  Avatar,
  Checkbox,
  CircularProgress,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Popover,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { IconDotsVertical, IconEdit, IconEye, IconTrash } from '@tabler/icons';
import { useState } from 'react';
import Label from 'ui-component/label/Label';
import { Link as LinkRouter } from 'react-router-dom';
import ModalDialog from 'ui-component/ModalDialog';
import { useMutation } from 'react-query';
import { Fetcher } from 'utils/api';
import { toastMessage } from 'utils/helpers';

export const ROLES = [
  { label: 'User', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' }
];
//------------------------------------------------------------------------------

const UserListTile = ({ user, selectedUser, onCheckBoxClicked, currentUserRole, deleteUser, onEdit }) => {
  const { id, firstName, lastName, role, email, verified, status, createdAt, profile } = user;

  //Open menu
  const [openMenu, setOpenMenu] = useState(null);
  const handleOpenMenu = (e) => {
    setOpenMenu(e.target);
  };
  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const [openModal, setOpenModal] = useState({
    show: false,
    action: null
  });

  const handleOpenModal = (action) => {
    setOpenModal({ show: true, action });
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenModal({ show: false, action: null });
    handleCloseMenu(null);
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: () => Fetcher.delete('users/' + id),
    onSuccess: deleteUser,
    onError(error) {
      toastMessage(error.message, { isError: true });
    }
  });

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selectedUser}
        sx={{ p: 0, color: 'error', opacity: isLoading ? 0.4 : undefined }}
      >
        <TableCell padding="checkbox">
          {isLoading ? (
            <CircularProgress size={16} color="error" />
          ) : (
            <Checkbox checked={selectedUser} onChange={onCheckBoxClicked} disabled={isLoading} />
          )}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Tooltip title={profile?.username ? `@${profile?.username}` : 'No Profile'}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar src={profile?.profilePic} sx={{ color: 'white', fontWeight: 'bold' }}>
                {firstName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" noWrap sx={{ cursor: 'pointer' }}>
                {firstName} {lastName}
              </Typography>
            </Stack>
          </Tooltip>
        </TableCell>

        <TableCell align="left">
          <Link color="inherit" underline="hover">
            {email}
          </Link>
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" spacing={1}>
            <Label>{status}</Label>
            <Label color={verified ? 'success' : 'secondary'}>{verified ? 'Verified' : 'Unverified'}</Label>
          </Stack>
        </TableCell>
        <TableCell align="center">{role.replace('_', ' ')}</TableCell>
        <TableCell align="center">
          {new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </TableCell>

        <TableCell align="right">
          <IconButton size="large" color="inherit" onClick={handleOpenMenu} disabled={isLoading}>
            <IconDotsVertical size={18} />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={Boolean(openMenu)}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        <MenuItem component={LinkRouter} to={'/users/' + id}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconEye size={18} />
            <Typography>Details</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onEdit();
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconEdit size={18} />
            <Typography>Edit</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          disabled={!((role === 'ADMIN' && currentUserRole === 'SUPER_ADMIN') || role === 'USER')}
          onClick={() => handleOpenModal('DELETE')}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconTrash size={18} />
            <Typography>Delete</Typography>
          </Stack>
        </MenuItem>
      </Popover>
      <ModalDialog
        title="Delete User? 😢"
        subTitle={`Are you sure do you want to delete this user? Profiles, Performances, Awards and Activities related to this user will also be deleted.`}
        open={openModal.show}
        handleClose={handleCloseModal}
        hardWarning="Damn, he/she won't be able to use this account again. Still sure and understand effects??"
        handleClickOk={() => {
          mutate();
          handleCloseModal();
        }}
        item={
          <ListItem sx={{ boxShadow: 1, borderRadius: 2, my: 3 }}>
            <ListItemAvatar>
              <Avatar src={profile?.profilePic} sx={{ color: 'white', fontWeight: 'bold' }}>
                {firstName.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${firstName} ${lastName}`} secondary={profile?.username ? `@${profile?.username}` : email} />
          </ListItem>
        }
      />
    </>
  );
};

export const UserListTileLoading = () => {
  return (
    <TableRow hover tabIndex={-1} role="checkbox" sx={{ p: 0, color: 'error' }}>
      <TableCell padding="checkbox">
        <Checkbox checked={false} onChange={() => {}} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Tooltip title={'Profile'}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <div>
              <Skeleton variant="circular" width={40} height={40} />
            </div>
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
          </Stack>
        </Tooltip>
      </TableCell>

      <TableCell align="left">
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </TableCell>

      <TableCell align="center">
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </TableCell>
      <TableCell align="center">
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </TableCell>
      <TableCell align="center">
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </TableCell>

      <TableCell align="right">
        <Skeleton variant="rectangular" width={5} height={20} />
      </TableCell>
    </TableRow>
  );
};

export default UserListTile;
