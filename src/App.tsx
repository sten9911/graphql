import { useState } from 'react';
import UserForm from './componenets/UserForm';
import BasicInformation from './componenets/BasicInformation';
import Graphs from './componenets/Graphs';

function App() {
  const [login, setLogin] = useState("")
  const [validLogin, setValidLogin] = useState(false)

  return (
    <div className="App m-2">
      <UserForm setLogin={setLogin} />
        <div>
          {login && <BasicInformation login={login} setValidLogin={setValidLogin} getValidLogin={validLogin} />}
        </div>
        {validLogin ? <><Graphs login={login}></Graphs></> : <></>}
    </div>
  );
}

export default App;
