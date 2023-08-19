import { Button, Card, CardHeader, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { IconSquareRoundedX, IconUserPlus } from '@tabler/icons';
import Scrollbar from './Scrollbar';

const TitleAndSidebar = ({ children, onOpenSidebar, onCloseSidebar, openSidebar, title, drawerTitle }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h3">{title}</Typography>}
        action={
          <Button
            variant="contained"
            endIcon={<IconUserPlus size={16} />}
            color="primary"
            sx={{ borderRadius: 1.4, boxShadow: 'none' }}
            onClick={onOpenSidebar}
          >
            Create Account
          </Button>
        }
      />
      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: { width: 320, border: 'none', overflow: 'hidden' }
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="h4" sx={{ ml: 1 }}>
            {drawerTitle}
          </Typography>
          <IconButton onClick={onCloseSidebar}>
            <IconSquareRoundedX />
          </IconButton>
        </Stack>
        <Divider />
        <Scrollbar>
          <Stack spacing={2} sx={{ p: 2 }}>
            {children}
          </Stack>
        </Scrollbar>
      </Drawer>
    </Card>
  );
};

export default TitleAndSidebar;
