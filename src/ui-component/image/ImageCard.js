import { CircularProgress, IconButton, ImageListItem, Stack } from '@mui/material';
import { IconTrash } from '@tabler/icons';
import { useState } from 'react';
import { useMutation } from 'react-query';
import ModalDialog from 'ui-component/ModalDialog';
import { Fetcher } from 'utils/api';
import { toastMessage } from 'utils/helpers';

const ImageCard = ({ image, performanceId, onSuccess, canDelete, isActivity = false }) => {
  //
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  //
  const { isLoading, mutate } = useMutation({
    mutationFn: (body) => Fetcher.patch(`${isActivity ? 'activities' : 'performances'}/removeImage/` + performanceId, body),
    onSuccess,
    onError: (error) => {
      toastMessage(error.message, { isError: true });
    }
  });
  //
  const handleDelete = () => {
    handleCloseModal();
    mutate({ image });
  };
  //

  return (
    <>
      <ImageListItem sx={{ position: 'relative' }}>
        {canDelete && (
          <Stack
            sx={{ top: 5, right: 5, position: 'absolute', backgroundColor: 'secondary.main', borderRadius: 25, p: isLoading ? 0.8 : 0.4 }}
          >
            {isLoading ? (
              <CircularProgress size={16} sx={{ color: 'white' }} />
            ) : (
              <IconButton onClick={handleOpenModal} sx={{ p: 0.5 }}>
                <IconTrash size={16} />
              </IconButton>
            )}
          </Stack>
        )}
        <img src={image} alt="#" loading="lazy" style={{ objectFit: 'cover', width: 170, height: 170 }} height={170} />
      </ImageListItem>
      <ModalDialog
        title="DELETE PHOTO"
        subTitle={`Are you sure do you want to remove this photo from the ${isActivity ? 'activity' : 'performance'}?`}
        open={openModal}
        handleClose={handleCloseModal}
        handleClickOk={handleDelete}
        item={
          <img src={image} alt="#" loading="lazy" style={{ objectFit: 'contain', width: '100%', margin: '10px auto', maxHeight: 300 }} />
        }
      ></ModalDialog>
    </>
  );
};

export default ImageCard;
