import React from 'react'

export default function Home(props){
    return(
        <div className="home-container">
            <button className="btn startGame" onClick={props.startGame}>Start game</button>
            <button className="btn ladder" onClick={props.seeRanking}>Ladder</button>
        </div>
    )
}
