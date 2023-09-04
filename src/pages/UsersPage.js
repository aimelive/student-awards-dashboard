import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { UserListHead, UserListTile } from 'sections/user';
import DataWidget from 'ui-component/DataWidget';
import Scrollbar from 'ui-component/Scrollbar';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Fetcher } from 'utils/api';
import useScriptRef from 'hooks/useScriptRef';
import TitleAndSidebar from 'ui-component/TitleAndSidebar';
import { compareObj, toastMessage } from 'utils/helpers';
import { useUser } from 'providers/UserProvider';
import { UserListTileLoading } from 'sections/user/UserListTile';

const ROLES = [
  { label: 'User', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' }
];

const STATUS_VALUES = ['ACTIVE', 'IDLE', 'DISABLED', 'DELETED'];

const TABLE_HEAD = [
  { id: 'name', label: 'Full Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'createdAt', label: 'Created At', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.names.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const UsersPage = () => {
  const { user } = useUser();

  const clientQuery = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: () => Fetcher.get('users'), retry: false });
  const users = data || [];
  //----------------------------------------------------------------
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users?.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const scriptedRef = useScriptRef();

  const [openSidebar, setOpenSidebar] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const onOpenSidebar = () => {
    setOpenSidebar(true);
  };
  const onCloseSidebar = () => {
    setOpenSidebar(false);
    setEditingUser(null);
  };

  return (
    <>
      <TitleAndSidebar
        title="User Accounts"
        drawerTitle={editingUser ? 'Update Account' : 'Create Account'}
        openSidebar={openSidebar}
        onOpenSidebar={onOpenSidebar}
        onCloseSidebar={onCloseSidebar}
      >
        <Formik
          initialValues={{
            email: editingUser?.email ?? '',
            firstName: editingUser?.firstName ?? '',
            lastName: editingUser?.lastName ?? '',
            role: editingUser?.role ?? ROLES[0].value,
            status: editingUser?.status ?? STATUS_VALUES[1],
            submit: null
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
            firstName: Yup.string().min(3).max(20).required('First name is required'),
            lastName: Yup.string().min(3).max(20).required('Last name is required'),
            role: Yup.string()
              .oneOf(
                [...ROLES, { value: 'SUPER_ADMIN' }].map((role) => role.value),
                'Invalid role'
              )
              .required('Role is required'),
            status: Yup.string().oneOf(STATUS_VALUES, 'Invalid status').required('Status is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (!editingUser) {
                  const user = await Fetcher.post('users', { ...values, submit: undefined });
                  clientQuery.setQueryData(['users'], [user, ...users]);

                  toastMessage('Congratulations 🎉, you have created new user account successfully! 🎉');
                } else {
                  const newObj = compareObj(editingUser, {
                    ...values,
                    role: editingUser.role === 'SUPER_ADMIN' ? undefined : values.role,
                    status: editingUser.role === 'SUPER_ADMIN' ? undefined : values.status,
                    submit: undefined
                  });
                  if (!Object.keys(newObj).length) {
                    throw new Error('No changes made.');
                  }
                  const user = await Fetcher.patch('users/' + editingUser.id, newObj);
                  clientQuery.setQueryData(
                    ['users'],
                    users.map((data) => (data.id === user.id ? { ...user, profile: data.profile } : data))
                  );
                  //
                  toastMessage(
                    newObj.email
                      ? `Email account changed, the user will need to verify the new email to access the account. 😟`
                      : 'User account has updated successfully! 🎉',
                    { isWarning: newObj.email }
                  );
                }
                setSubmitting(false);
                setStatus({ success: true });
                onCloseSidebar();
              }
            } catch (err) {
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              {editingUser && (
                <ListItem sx={{ boxShadow: 2, borderRadius: 2.5, my: 1, mb: 4 }}>
                  <ListItemAvatar>
                    <Avatar src={editingUser?.profilePic} sx={{ color: 'white', fontWeight: 'bold' }}>
                      {(values.firstName || editingUser.firstName).charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${values.firstName || '<first-name>'} ${values.lastName || '<last-name>'}`}
                    secondary={values.email || '<email>'}
                  />
                </ListItem>
              )}
              <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)}>
                <InputLabel htmlFor="outlined-adornment-email-login">First Name</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email-login"
                  type="text"
                  value={values.firstName}
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="First Name"
                  inputProps={{}}
                />
                {touched.firstName && errors.firstName && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.firstName}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)} sx={{ my: 2 }}>
                <InputLabel htmlFor="outlined-adornment-email-login">Last Name</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email-login"
                  type="text"
                  value={values.lastName}
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Last Name"
                  inputProps={{}}
                />
                {touched.lastName && errors.lastName && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.lastName}
                  </FormHelperText>
                )}
              </FormControl>
              {editingUser?.role !== 'SUPER_ADMIN' && (
                <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                  <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email Address"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              {user.role === 'SUPER_ADMIN' && editingUser?.role !== 'SUPER_ADMIN' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel htmlFor="outlined-adornment-role">Role</InputLabel>
                  <Select id="outlined-adornment-role" value={values.role} name="role" onChange={handleChange} label="Role">
                    {ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.role && errors.role && (
                    <FormHelperText error id="standard-weight-helper-text-role-login">
                      {errors.role}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              {user.role === 'SUPER_ADMIN' && editingUser?.role !== 'SUPER_ADMIN' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel htmlFor="outlined-adornment-status">Status</InputLabel>
                  <Select id="outlined-adornment-status" value={values.status} name="status" onChange={handleChange} label="Status">
                    {STATUS_VALUES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.status && errors.status && (
                    <FormHelperText error id="standard-weight-helper-text-status-login">
                      {errors.status}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="error" variant="filled">
                    {errors.submit}
                  </Alert>
                </Box>
              )}
              <Box sx={{ my: 3 }} />
              <AnimateButton>
                <Button
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ borderRadius: 3, elevation: 0, boxShadow: 'none', py: 1.2 }}
                  startIcon={isSubmitting ? <CircularProgress size={15} color="inherit" /> : undefined}
                >
                  {editingUser ? 'Update Account' : ' Create Account'}
                </Button>
              </AnimateButton>
            </form>
          )}
        </Formik>
      </TitleAndSidebar>
      <Card sx={{ p: 1 }}>
        <DataWidget
          title="User accounts"
          isLoading={isLoading}
          isError={error}
          isEmpty={!users?.length}
          customLoaders={
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, overflowX: 'hidden' }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={users?.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    <UserListTileLoading />
                    <UserListTileLoading />
                    <UserListTileLoading />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          }
        >
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, overflowX: 'hidden' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const selectedUser = selected.indexOf(row.email) !== -1;

                    return (
                      <UserListTile
                        user={row}
                        selectedUser={selectedUser}
                        key={row.id}
                        onCheckBoxClicked={(event) => handleClick(event, row.email)}
                        deleteUser={() => {
                          clientQuery.setQueryData(
                            ['users'],
                            users.filter((user) => user.id != row.id)
                          );
                        }}
                        currentUserRole={user.role}
                        onEdit={() => {
                          setEditingUser({ ...row, profile: null, profilePic: row.profile?.profilePic });
                          onOpenSidebar();
                        }}
                      />
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>
                            .
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </DataWidget>
      </Card>
    </>
  );
};

export default UsersPage;
