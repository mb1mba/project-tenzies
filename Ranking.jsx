import React from 'react'

export default function Ranking(props){
    return(
        <div>
            <h2><span>{props.rank}</span>. {props.value} rounds</h2>

        </div>
    )
}