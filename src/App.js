import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login.jsx';

const App = () => {
  return (
    <div>
      i am a react app cool
      <Login />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
