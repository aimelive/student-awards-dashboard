import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Typography,
  styled
} from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons';
import { useState } from 'react';
import { Keys } from 'utils/keys';
import ModalDialog from './ModalDialog';
const CustomTypography = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemCard = ({ width, title, description, image, label, color, onEdit, name, disabled = false, onDeleteClick }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Card sx={{ position: 'relative', opacity: 1, width, minWidth: width }}>
        {label && (
          <Chip
            label={label}
            size="small"
            color={color || 'primary'}
            sx={{
              px: 0.5,
              zIndex: 9,
              top: 8,
              right: 8,
              position: 'absolute',
              fontSize: '12px',
              color: 'white'
            }}
          />
        )}
        <CardActionArea disabled={disabled} href={`${Keys.FRONTEND_URL}${'aimelive'}#awards`} target="_blank">
          <CardMedia component="img" image={image} alt="#" sx={{ height: 150 }} />

          <CardContent sx={{ px: 2, py: 1 }}>
            <CustomTypography gutterBottom variant="h5" component="div">
              {title}
            </CustomTypography>
            <CustomTypography variant="body2" color="text.secondary">
              {description}
            </CustomTypography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ py: 1, px: 2 }}>
          <Button size="small" color="secondary" disabled={disabled} startIcon={<IconEdit size={16} />} onClick={onEdit}>
            Edit
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={disabled}
            startIcon={disabled ? <CircularProgress size={16} /> : <IconTrash size={16} />}
            onClick={handleOpenModal}
          >
            Remove
          </Button>
        </CardActions>
      </Card>
      <ModalDialog
        title={`Delete ${name}? 😢`}
        subTitle={`Are you sure do you want to delete this ${name?.toLowerCase()}.`}
        open={openModal}
        handleClose={handleCloseModal}
        hardWarning={`Damn!😮🥱😱 still sure do you want to remove?`}
        handleClickOk={() => {
          onDeleteClick();
          handleCloseModal();
        }}
        item={
          <Card sx={{ boxShadow: 1, borderRadius: 2, my: 3 }}>
            <CardActionArea disabled={false} href={`${Keys.FRONTEND_URL}${'aimelive'}#awards`} target="_blank">
              <CardMedia component="img" image={image} alt="#" sx={{ height: 150 }} />

              <CardContent sx={{ px: 2, py: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {title}
                </Typography>
                <CustomTypography variant="body2" color="text.secondary">
                  {description}
                </CustomTypography>
              </CardContent>
            </CardActionArea>
          </Card>
        }
      />
    </>
  );
};

export default ItemCard;
