//Core
import './App.css';

//Components
import Router from './components/Router';
import GlobalProviders from './core/GlobalProviders';

//UI
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Nunito', 'sans-serif'].join(','),
  },
});

function App() {
  return (
    <GlobalProviders>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </GlobalProviders>
  );
}

export default App;
