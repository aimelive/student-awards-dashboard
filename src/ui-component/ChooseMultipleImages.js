import { Button, IconButton, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import { IconCirclePlus, IconTrash } from '@tabler/icons';

const ChooseMultipleImages = ({ onChange, images: files, onRemove, label }) => {
  //
  const handleChange = (e) => {
    let files = e.target.files;

    var allFiles = [];

    for (var i = 0; i < files.length; i++) {
      let file = files[i];

      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          url: reader.result
        };

        allFiles.push(fileInfo);

        if (allFiles.length == files.length) {
          onChange(allFiles);
        }
      };
    }
  };
  return (
    <Stack spacing={1} sx={{ my: 1 }}>
      <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
      {/* <Grid container spacing={2} sx={{ m: 'auto' }}>
        {images.map((image, index) => {
          return (
            <Grid key={index} item sm={6} xs={12}>
              <Stack sx={{ position: 'relative' }}>
                <img src={image} alt="#" loading="lazy" />
                <Stack
                  alignItems="center"
                  justifyContent={'center'}
                  sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#272727' }}
                >
                  <IconButton>
                    <IconTrash />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
          );
        })}
      </Grid> */}
      <ImageList cols={2} rowHeight={150} sx={{ my: 1 }}>
        {files.map((file, index) => {
          return (
            <ImageListItem key={index} sx={{ position: 'relative' }}>
              <Stack sx={{ top: 5, right: 5, position: 'absolute', backgroundColor: 'secondary.main', borderRadius: 25 }}>
                <IconButton onClick={() => onRemove(file)} sx={{ p: 0.5 }}>
                  <IconTrash size={16} />
                </IconButton>
              </Stack>
              <img src={file.url} alt="#" loading="lazy" style={{ objectFit: 'cover', height: 150 }} height={150} />
            </ImageListItem>
          );
        })}
      </ImageList>
      <Button
        variant="outlined"
        component="label"
        color="secondary"
        startIcon={<IconCirclePlus size={16} />}
        sx={{ borderRadius: 3, boxShadow: 'none', py: 1, mt: 1 }}
        disabled={files.length === 5}
      >
        <span>Add Images</span>
        <input type="file" hidden accept="image/png,image/jpeg,image/jpg" onChange={handleChange} multiple={true} />
      </Button>
    </Stack>
  );
};

export default ChooseMultipleImages;
