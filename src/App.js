import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Providers } from 'providers';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <QueryClientProvider client={queryClient}>
            <Providers>
              <Routes />
              <Toaster toastOptions={{ duration: 10000, style: { padding: 0, boxShadow: 'none', backgroundColor: 'transparent' } }} />
            </Providers>
          </QueryClientProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
