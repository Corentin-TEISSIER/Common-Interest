import "./style/App.css";
import AppHeader from "./components/AppHeader.js";
import AppBody from "./components/AppBody";
import AppContext from "./components/AppContext.js";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [state, setState] = useState({
    filters: [],
    user: { name: "john", age: 24, location: "milano" },
    request: [
      { name: "john", age: 24, location: "milano", interest: [] },
      { name: "john1", age: 23, location: "milanoas", interest: [] },
      { name: "john2", age: 23, location: "milanoas", interest: [] },
      { name: "john3", age: 23, location: "milanoas", interest: [] },
    ],
    friends: [],
  });
  return (
    <AppContext.Provider value={{ state, setState }}>
      <div className="App">
        <header className="App-header">
          <AppHeader />
        </header>
        <BrowserRouter>
          <div id="body-div">
            <AppBody />
          </div>
          <footer>{/* <AppMenu id="app-menu"/> */}</footer>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;
