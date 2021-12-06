//Core
import './App.css';

//Components
import Router from './components/Router';

//UI
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Nunito', 'cursive'].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />;
    </ThemeProvider>
  );
}

export default App;
