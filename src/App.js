//Core
import './App.css';

//Components
import AppScaffold from './components/AppScaffold';
import Router from './components/Router';

function App() {
  return (
    <Router>
      <AppScaffold />;
    </Router>
  );
}

export default App;
