import { Alert, Box, Button, CircularProgress } from '@mui/material';
import AnimateButton from './extended/AnimateButton';

const SubmitFormButton = ({ errors, isSubmitting, title }) => {
  return (
    <>
      {errors.submit && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error" variant="filled">
            <div dangerouslySetInnerHTML={{ __html: errors.submit }}></div>
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
          {title}
        </Button>
      </AnimateButton>
    </>
  );
};

export default SubmitFormButton;
