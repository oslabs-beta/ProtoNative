import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppContext from './context/AppContext';
import MainContainer from './components/containers/MainContainer';
import NavBarContainer from './components/top/NavBarContainer';

const App = () => {
  const [originals, setOriginals] = React.useState({});
  const [copies, setCopies] = React.useState({});
  const [currentComponent, setCurrentComponent] = React.useState(null);
  return (
    <AppContext.Provider value={{originals, setOriginals, copies, setCopies, currentComponent, setCurrentComponent}}>
      <div>
        <NavBarContainer />
        <MainContainer />
      </div>
    </AppContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
