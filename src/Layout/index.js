import React, { Fragment, useState, useEffect } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Decklist from "../Home/Decklist.jsx";
import DeckForm from "../DeckDisplay/DeckForm.jsx";
import CardForm from "../DeckDisplay/CardForm.jsx";
import DisplayDeck from "../DeckDisplay/DisplayDeck.jsx";
import StudyDeck from "../DeckDisplay/StudyDeck.jsx";
import { listDecks } from "../utils/api";

function Layout() {
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([]);
  const [card, setCard] = useState({});
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    const aborter = new AbortController();

    const getDecks = async () => {
      try {
        const data = await listDecks(aborter.signal);
        setDecks(() => {
          return data;
        });
      } catch (aFit) {
        if (aFit.name === "AbortError") {
          console.log(aFit);
        } else {
          throw aFit;
        }
      }
    };
    getDecks();

    return () => {
      aborter.abort();
    };
  }, [reRender]);

  return (
    <Fragment>
      <Header />
      <div className="container">
        <Switch>
          <Route path="/decks/:deckId/cards/:cardId/edit">
            <CardForm
              card={card}
              setCard={setCard}
              reRender={reRender}
              setReRender={setReRender}
              deck={deck}
              setDeck={setDeck}
            />
          </Route>
          <Route path="/decks/:deckId/cards/new">
            <CardForm
              card={card}
              setCard={setCard}
              reRender={reRender}
              setReRender={setReRender}
              deck={deck}
              setDeck={setDeck}
            />
          </Route>
          <Route path="/decks/:deckId/study">
            <StudyDeck cards={cards} setCards={setCards} />
          </Route>
          <Route exact path="/decks/new">
            <DeckForm
              deck={deck}
              setDeck={setDeck}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Route>
          <Route path="/decks/:deckId/edit">
            <DeckForm
              deck={deck}
              setDeck={setDeck}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Route>
          <Route path="/decks/:deckId">
            <DisplayDeck
              deck={deck}
              setDeck={setDeck}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Route>
          <Route exact path="/">
            <Decklist decks={decks} setDecks={setDecks} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Fragment>
  );
}

export default Layout;
