import { Button, ButtonBase, CircularProgress, ImageListItem, Stack, Typography } from '@mui/material';
import { IconPhotoPlus } from '@tabler/icons';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { Fetcher } from 'utils/api';
import { toastMessage } from 'utils/helpers';

const AddImageCard = ({ id, onAdded, isActivity = false }) => {
  const [image, setImage] = useState();

  const { isLoading, mutate } = useMutation({
    mutationFn: (body) => Fetcher.patch(`${isActivity ? 'activities' : 'performances'}/addImage/` + id, body),
    onSuccess: (data) => {
      onAdded(data);
      setImage(null);
    },
    onError: (error) => {
      toastMessage(error.message, { isError: true });
    }
  });

  const handleClickUpload = () => {
    // setError('');
    const input = document.getElementById('choose-file-upload');
    input?.click();
  };
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    // setSelectedImage(files[0]);
    var reader = new FileReader();

    reader.onloadend = function () {
      //Base 64
      setImage(reader.result);
    };

    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };
  return (
    <ImageListItem sx={{ position: 'relative' }}>
      {image ? (
        <>
          <img src={image} alt="#" loading="lazy" style={{ objectFit: 'cover', width: 170, height: 170 }} height={170} />
          <Stack
            sx={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute', backgroundColor: '#aad9ae4d' }}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ boxShadow: 0, color: 'white', py: 0.5, borderRadius: 1 }}
              onClick={() => {
                mutate({ image });
              }}
              startIcon={isLoading ? <CircularProgress color="inherit" size={16} /> : <IconPhotoPlus size={18} />}
            >
              Upload
            </Button>
          </Stack>
        </>
      ) : (
        <ButtonBase sx={{ height: '100%' }} onClick={handleClickUpload}>
          <input type="file" id="choose-file-upload" hidden accept="image/png,image/jpeg,image/jpg" onChange={handleFileChange} />
          <Stack alignItems={'center'} justifyContent={'center'} spacing={0.5}>
            <IconPhotoPlus />
            <Typography>Add photo</Typography>
          </Stack>
        </ButtonBase>
      )}
    </ImageListItem>
  );
};

export default AddImageCard;
