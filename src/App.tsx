import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Login from './components/Login';

const App = () => {
  return (
    <div>
      i am a react app cool
      <Login />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
