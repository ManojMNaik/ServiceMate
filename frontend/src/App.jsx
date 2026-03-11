import { BrowserRouter,Routes,Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";

function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<AuthForm/>} />

        <Route path="/home" element={<Home/>} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;