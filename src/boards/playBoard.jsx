import React from 'react';
import Hand from './components/hand';
import Field from './components/field';
import Pile from './components/pile';
import { getCardImage } from './board';
import './styles/playBoard.css';

const isEqual = require('lodash.isequal');

class PlayBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hoveredCard: null,
            selectedCard: null,
        };
    }
    //PLAYHAND EVENTS
    onCardHover = (card) => {
        this.setState({ hoveredCard: card});
    };

    onCardSelect = (card) => {
        this.setState({ selectedCard: card});
    };

    onCardDeselectClick = (event) => {
        const classes = event.target.classList;
        if (!classes.contains('hand-card') && 
            !classes.contains('field-card') &&
            !classes.contains('add-field')) {
            this.setState({ selectedCard: null});
        }
    };
    
    //GENERATE CARD HTML
    getCardElement = (card, otherClasses='', events={}) => {
        if (card) {
            return (
                <div className={'game card ' + otherClasses}
                    onMouseEnter={events.onMouseEnter}
                    onMouseLeave={events.onMouseLeave}
                    onClick={events.onClick}>
                    <div className={'game card-inside ' + otherClasses}
                        style={getCardImage(card.id)}>
                    </div>
                </div>
            );
        } else {
            return ( <div className={'game card ' + otherClasses}></div> );
        }
    }

    getHandCardElement = (card, stage) => {
        var otherClasses = 'hand-card';

        var events;
        if (stage === 'playHand') {
            otherClasses += ' active';
            events = {
                onMouseEnter: () => this.onCardHover(card),
                onMouseLeave: () => this.onCardHover(null),
                onClick: () => this.onCardSelect(card),
            }
        }
        
        if (isEqual(card, this.state.selectedCard)) {
            otherClasses += ' selected';
        }

        return this.getCardElement(card, otherClasses, events);
    }

    render() {
        const stage = this.props.stage;
        const playerHand = this.props.playerHand;
        const playerPile = this.props.playerPile;
        const opponentHand = this.props.opponentHand;
        const opponentPile = this.props.opponentPile;
        const fieldCards = this.props.fieldCards;
        const deckTop = this.props.deckTop;

        return (
            <div onClick={(event) => {
                if (stage === 'playHand') {
                    this.onCardDeselectClick(event)
                }}}>
                
                <div className='player'>
                    <Hand 
                        cards={opponentHand} 
                        getCardElement={(_card) => this.getCardElement(null, 'no-click')}
                    ></Hand>
                    <Pile
                        cards={opponentPile}
                        getCardElement={(card) => this.getCardElement(card, 'no-click pile-card')}
                    ></Pile>
                </div>

                <Field
                    stage={stage}
                    cards={fieldCards}
                    deckTop={deckTop}
                    // getDeckElement={() => {
                    //     if (stage === 'playDeck') {
                    //         //deck always appears selected when visible
                    //         return this.getCardElement(deckTop, 'deck selected');
                    //     } else {
                    //         return this.getCardElement(null, 'deck');
                    //     }
                    // }}
                    getCardElement={this.getCardElement}
                    hoveredCard={this.state.hoveredCard}
                    selectedCard={this.state.selectedCard}
                    onPlayHand={this.props.onPlayHand}
                    onPlayDeck={this.props.onPlayDeck}
                    onCardSelect={this.onCardSelect}
                    // onEndStage={this.props.onEndStage}
                    playerPile={playerPile}
                ></Field>

                <div className='player'>
                    <Hand 
                        cards={playerHand} 
                        getCardElement={(card) => this.getHandCardElement(card, stage)}
                    ></Hand>
                    <Pile
                        cards={playerPile}
                        getCardElement={(card) => this.getCardElement(card, 'pile-card')}
                    ></Pile>
                </div>
            </div>
        );
    }
}

export default PlayBoard;