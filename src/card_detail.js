import React from "react";
import './card_detail.css';

export default function CardDetail(props) {
    function produceList() {
        let enumerationList = [];
        let id = 0;
        props.cardEntries.forEach((entry) => enumerationList.push(highlightHanzi(entry, id++)));
        return enumerationList;
    }

    function highlightHanzi(entry, key) {
        const toHighlight = props.questionCard.hanzi;
        let hanziSegments = entry.hanzi.split(toHighlight);
        let joinedSegments = [];
        let id = 0;
        hanziSegments.forEach((segment) => {
                if (!segment) {
                    joinedSegments.push(<span className="highlight" key={id++}>{toHighlight}</span>);
                } else {
                    joinedSegments.push(<span className="neutral" key={id++}>{segment}</span>);
                    joinedSegments.push(<span className="highlight" key={id++}>{toHighlight}</span>);
                }
            }
        );
        // Last split segment is not delimiter itself
        joinedSegments.pop();

        return <li key={key}>
            <div className="list-row">
                <div className="enumeration"> {key} </div>
                <div className="sentence">  {joinedSegments} </div>
            </div>
        </li>;
    }

    return (
        <div className="card-detail">
            <div>Some corresponding words/sentences found in your Pleco file.</div>
            {produceList()}
        </div>
    );
}