import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import MainCard from '../ui-component/cards/MainCard';
import AuthWrapper1 from 'ui-component/login/AuthWrapper1';
import AuthCardWrapper from 'ui-component/login/AuthCardWrapper';

const NotFound = () => {
  const nav = useNavigate();
  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <MainCard title="Page Not Found">
                    <Typography variant="body2">The page you are looking for does not exist.</Typography>
                    <Button sx={{ mt: 2 }} onClick={() => nav('/')}>
                      Go to Home
                    </Button>
                  </MainCard>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default NotFound;
