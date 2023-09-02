import { Avatar, Button, ButtonBase, Card, CardHeader, Divider, Drawer, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { IconPlus, IconSquareRoundedX, IconUserPlus } from '@tabler/icons';
import Scrollbar from './Scrollbar';

const TitleAndSidebar = ({ children, onOpenSidebar, onCloseSidebar, openSidebar, title, drawerTitle, customTitle }) => {
  const theme = useTheme();
  return (
    <>
      {customTitle ? (
        <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h3">{title}</Typography>
          <ButtonBase sx={{ borderRadius: '12px' }} onClick={onOpenSidebar}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light
                }
              }}
              // ref={anchorRef}
              // aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              // onClick={handleToggle}
              color="inherit"
            >
              <IconPlus stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Stack>
      ) : (
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
                {drawerTitle}
              </Button>
            }
          />
        </Card>
      )}
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
    </>
  );
};

export default TitleAndSidebar;
