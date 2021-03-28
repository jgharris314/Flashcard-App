import React, {Fragment} from 'react';
import CardListItem from './CardListItem.jsx'

function CardList({cards = []}) {
    return (
        <Fragment>
        <ul className="CardList list-group">
            {cards.map((card) => <CardListItem card={card} />)}
        </ul>
        </Fragment>
    )
}

export default CardList;