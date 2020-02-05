import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Entry from './entry.js';
import Mode from './mode_selector.js';
import LoadDialog from './load_dialog.js';


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
            isRunning: false,
            showGameStatus: false,
            answerCorrect: false,
            answers: Array(4).fill(null), //the 4 possible current answers
            question: new Entry("水", "shuǐ", "water"), //the correct answer card
            player: "X",
            entries: null, //describing all parsed entries
            mode: new Mode(null) //decides which field of the entry is questioned and answered
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
        let answers = this.shuffle(this.state.entries.slice()).slice(0, 4);
        let question = this.shuffle(answers.slice())[0];
        this.setState({
            showGameStatus: false,
            isRunning: true,
            answers: answers,
            question: question,
        });

    }

    updateEntryData(entries) {
        this.setState({
            entries: entries,
            isGame: true,
        });
    }

    render() {
        if (!this.state.isGame) {
            return <LoadDialog loadData={(entries) => this.updateEntryData(entries)}/>
        }

        if (!this.state.isRunning) {
            return <button className="start-dialog" onClick={() => this.setUpNewRound()}>Click to start</button>;
        }

        return (
            <div>
                <h1 className="game-title">Chinese characters game</h1>
                <div className="question-bar"> How is the character pronounced? <br/> <span
                    id="question-highlight"> {this.state.mode.getQuestionField(this.state.question)}  </span>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            mode={this.state.mode}
                            answers={this.state.answers}
                            onClick={(i) => this.evaluateAnswer(i)}
                        />

                        {this.state.showGameStatus ? <GameStatus
                            status={this.state.answerCorrect}
                            onClick={() => this.setUpNewRound()}
                        /> : null}
                    </div>
                </div>
            </div>
        );
    }
}


// ========================================
ReactDOM.render(
    <div className="content"><Game/></div>,
    document.getElementById('root')
);
