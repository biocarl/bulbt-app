import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Card from './card.js';
import Mode from './mode_selector.js';
import LoadDialog from './load_dialog.js';
import CardDetail from './card_detail.js';


function Tile(props) {
    return (
            <button className="tile" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderTile(i) {
        return (<Tile
                value={this.props.mode.getAnswerField(this.props.answers[i])}
                onClick={() => this.props.onClick(i)}
                />);
    }

    render() {
        return (
                <div className="board">
                <div className="board-row">
                {this.renderTile(0)}
            {this.renderTile(1)}
            </div>
                <div className="board-row">
                {this.renderTile(2)}
            {this.renderTile(3)}
            </div>
                </div>
        );
    }
}

function GameStatus(props) {
    return (
            <button style={{background: props.status ? "#2196F3" : "#FF5722"}} className="game-status"
        onClick={props.onClick}>
            {props.status ? "Correct." : "Try again."}
        </button>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isGame: false,
            isRandom: false,
            relativePosition: 0,
            isRunning: false,
            showGameStatus: false,
            showDetails: false,
            answerCorrect: false,
            answers: Array(4).fill(null), //the 4 possible current answers
            question: new Card("水", "shuǐ", "water"), //the correct answer card
            player: "X",
            entries: null, //describing all parsed entries
            mode: new Mode(null) //decides which field of the card is questioned and answered
        }
    }

    evaluateAnswer(i) {
        const answerCorrect = this.state.answers[i] === this.state.question;

        this.setState({
            showGameStatus: true,
            answerCorrect: answerCorrect
        });
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    setUpNewRound() {
        let answers;
        let question;
        let position = this.state.relativePosition;

        if(this.state.isRandom){
            answers = this.shuffle(this.state.cards.slice()).slice(0, 4);
            question = this.shuffle(answers.slice())[0];
        }else{
            if(position >= this.state.cards.length){
                return;
            }
            answers = this.shuffle(this.state.cards.slice()).slice(0, 3);
            question = this.state.cards[this.state.relativePosition];
            answers.push(question);
            answers = this.shuffle(answers);
            position++;
            //this.shuffle(answers.slice())[0];
        }
        this.setState({
            showGameStatus: false,
            showDetails: false,
            relativePosition: position,
            isRunning: true,
            answers: answers,
            question: question,
        });
    }

    updateEntryData(cards, entries) {
        this.shuffle(cards);
        this.setState({
            cards: cards,
            entries: entries,
            isGame: true,
        });
    }

    render() {
        if (!this.state.isGame) {
            return <LoadDialog loadData={(cards, entries) => this.updateEntryData(cards, entries)}/>
        }

        if (!this.state.isRunning) {
            return <button className="start-dialog" onClick={() => this.setUpNewRound()}>Click to start</button>;
        }

        return (
                <div>
                <h1 className="game-title">Chinese characters game
            </h1>
             
                <h1 className="game-title">
            {"Card: " +this.state.relativePosition+ "/" + this.state.cards.length}
            </h1>

                <div className="question-bar"> How is the character pronounced? <br/>
                <span onClick={() => this.setState({showDetails: true})}
            id="question-highlight"> {this.state.mode.getQuestionField(this.state.question)}  </span>
                </div>
                <div className="game">
                <div className="game-board">
                <Board
            mode={this.state.mode}
            answers={this.state.answers}
            onClick={(i) => this.evaluateAnswer(i)}
                />
                </div>
                </div>
                {this.state.showDetails ? <CardDetail questionCard={this.state.question}
                 cardEntries={this.getEntriesAssociatedWithCard(this.state.question)}
                 onClick={() => this.showDetails()}/> : null}
            {this.state.showGameStatus ?
             <GameStatus status={this.state.answerCorrect} onClick={() => this.setUpNewRound()}/> : null}
            </div>
        );
    }

    getEntriesAssociatedWithCard(card) {
        let entries = [];
        this.state.entries.forEach((entry) => {
            if (entry.hanzi.includes(card.hanzi)) {
                console.log(entry.hanzi);
                entries.push(entry);
            }
        }
                                  );
        return entries;
    }
}


// ========================================
ReactDOM.render(
        <div className="content"><Game/></div>,
    document.getElementById('root')
);
