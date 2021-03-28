import React, {Fragment, useState, useEffect } from 'react';
import {Link, useRouteMatch, useHistory} from 'react-router-dom'
import {getDecks, deleteDeck} from '../utils/api'

export default function DecklistItem({deck}) {
    const history = useHistory();
   
    const {
        name,
        cards,
        description
    } = deck
    
    
    const  handleDelete = async () => {
        const result = window.confirm("Are you sure you want to delete?")

        if(result){
        await deleteDeck(deck.id)
        
        history.go(0)
        }
    }

    return (
        <li className="list-group-item">
            <div className="d-flex justify-content-between">
                <div>{name}</div>
                <div>{cards.length} cards</div>
            </div>
            <div>{description}</div>
            <div className="d-flex justify-content-between">
                <div className="left-buttons">
                    <Link className="mx-1 btn btn-primary" to={`/decks/${deck.id}`}>View</Link>
                    <Link className="mx-1 btn btn-primary" to={`/decks/${deck.id}/study`}>Study</Link>
                </div>
                <div className="right-buttons">
                    <button className="mx-1 btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </li>
    )
}