import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import { IconTrash } from '@tabler/icons';
import { useState } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '300px',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 3
};

const ModalDialog = ({ title, subTitle, open, handleClose, handleClickOk, item, hardWarning }) => {
  const [okText, setOkText] = useState('Ok');
  const [showHardWarning, setShowHardWarning] = useState(false);

  return (
    <Modal
      open={open}
      keepMounted
      onClose={() => {
        setOkText('Ok');
        setShowHardWarning(false);
        handleClose();
      }}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h3" id="child-modal-title" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{ height: 10 }}></Box>
        <Typography id="child-modal-description">{subTitle}</Typography>
        {item}
        {showHardWarning && (
          <Typography color="error" sx={{ textAlign: 'center', my: 2, fontWeight: '600' }}>
            {hardWarning}
          </Typography>
        )}
        <Grid container>
          <Grid item xs>
            <Button
              onClick={() => {
                setOkText('Ok');
                setShowHardWarning(false);
                handleClose();
              }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                if (hardWarning && okText === 'Ok') {
                  setOkText('Delete');
                  setShowHardWarning(true);
                  return;
                }
                setOkText('Ok');
                setShowHardWarning(false);
                handleClickOk();
              }}
              variant="outlined"
              color={showHardWarning ? 'error' : 'secondary'}
              startIcon={<IconTrash />}
            >
              {okText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ModalDialog;
