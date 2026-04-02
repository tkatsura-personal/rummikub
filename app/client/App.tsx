import Game from "./page/game";
import Lobby from "./page/lobby";
import Users from "./page/pickuser";


export default function App() {
    /*
    Navigation: starting page is user selecting
    after selecting user, put it in url param, then 
    session storage reads the value to be kept throughout the entire tab

    game ID will be kept specifically within URL param, since it changes as soon as you leave the game page.

    keep track of the actual move set (K7 from set 1 to set 4, O8 from set 3 to set 9, etc)
    */
    
    return (
        <div>
            <Users />
        </div>
    );
}