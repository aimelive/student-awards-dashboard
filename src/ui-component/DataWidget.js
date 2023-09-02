import CircularProgress from '@mui/material/CircularProgress';
import { Alert, AlertTitle, Container, Stack, Typography } from '@mui/material';

const DataWidget = ({ title, isLoading, isError = null, isEmpty, children, customEmptyMessage, customLoaders }) => {
  if (isLoading) {
    if (customLoaders) return customLoaders;
    return (
      <Stack justifyContent="center" alignItems="center" spacing={4} sx={{ py: 4 }}>
        <CircularProgress size={40} color="primary" />
        <Typography>{title ? title : 'Items'} loading, please wait...</Typography>
      </Stack>
    );
  }
  if (isError) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error" variant="outlined">
          <AlertTitle>{isError.error}!</AlertTitle>
          <div
            dangerouslySetInnerHTML={{
              __html: isError ? isError.message : 'Oops, Something went wrong due to unknown error. Try to refresh the page and try again.'
            }}
          />
        </Alert>
      </Container>
    );
  }
  if (isEmpty) {
    return (
      <Alert severity="info" variant="outlined" sx={{ backgroundColor: 'white' }}>
        <AlertTitle>No {title ? title?.toLowerCase() : 'items'} found!</AlertTitle>
        {customEmptyMessage
          ? customEmptyMessage
          : `There are no ${title ? title?.toLowerCase() : 'items'} in the
          system yet! Add new by clicking the button above. ☝️`}
      </Alert>
    );
  }
  return <>{children}</>;
};

export default DataWidget;
