import Game from "./page/game";
import Lobby from "./page/lobby";
import Users from "./page/pickuser";
import Notfound from "./page/notfound";
import Login from "./page/login";
import Signup from "./page/signup";
import Resetpass from "./page/resetpass";
import { Routes, Route } from "react-router-dom";


export default function App() {
    return (
        <Routes>
            <Route path = "/" element = {<Users/>}/>
            <Route path = "/lobby/:userId" element = {<Lobby/>}/>
            <Route path = "/game/:gameId/:userId" element = {<Game/>}/>
            <Route path = "/login" element = {<Login/>}/>
            <Route path = "/signup" element = {<Signup/>}/>
            <Route path = "/resetpass" element = {<Resetpass/>}/>
            <Route path = "/notfound" element = {<Notfound/>}/>
            <Route path = "*" element = {<Notfound/>}/>
        </Routes>
    )
}