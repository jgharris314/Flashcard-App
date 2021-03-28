import React, {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom'

import DecklistItem from "./DecklistItem.jsx"

function Decklist({decks}) {
   
    return (
        <Fragment>
            <div>
                <Link className="btn btn-secondary my-1" to={'/decks/new'}>Create Deck</Link>
            </div>
            <ul className="DeckList list-group">
                {decks.map((deck) => <DecklistItem deck={deck} />)}
            </ul>
        </Fragment>
    )
}

export default Decklist;