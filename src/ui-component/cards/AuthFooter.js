// material-ui
import { Link, Typography, Stack } from '@mui/material';

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://mcsa.io" target="_blank" underline="hover">
      mcsa.io
    </Typography>
    <Typography variant="subtitle2" component={Link} href="#" underline="hover">
      &copy; BAP PRESS
    </Typography>
  </Stack>
);

export default AuthFooter;
