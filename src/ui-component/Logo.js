import { Stack, Typography } from '@mui/material';
import logo from 'assets/images/logo.png';

const Logo = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <img src={logo} alt="Berry" height={50} />
      <Stack>
        <Typography color={'secondary'} variant="h2" sx={{ fontSize: 25, fontWeight: '900', color: 'secondary' }}>
          MCSA
        </Typography>
        {/* <Typography variant="caption">&copy;BAP PRESS</Typography> */}
      </Stack>
    </Stack>
  );
};

export default Logo;
