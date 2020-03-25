import React from "react";
import Card from "./card";
import Entry from "./entry";
import './load_dialog.css';

export default function LoadDialog(props) {
    var cardList;
    var entryList;

    function verifyAndLoad(props) {
        if (!cardList) {
            // TODO load HSK levels as default
            cardList = [
                new Card("水", "shuǐ", "water"),
                new Card("风", "fēng", "wind"),
                new Card("火", "huǒ", "fire"),
                new Card("而", "ér", "and"),
                new Card("者", "zhě", "person"),
                new Card("军", "jūn", "military"),
                new Card("土", "tŭ", "earth")
            ];
            entryList = [
                new Entry("我非常爱水！", "Wǒ fēicháng ài shuǐ!"),
                new Entry("风是一切的本质。", "Fēng shì yīqiè de běnzhí."),
                new Entry("火令人着迷", "Huǒ lìng rén zháomí"),
                new Entry("潮湿的土壤闻起来很香。", "Cháoshī de tǔrǎng wén qǐlái hěn xiāng.")
            ];
        }
        props.loadData(cardList, entryList);
    }

    return (
        <div>
            <div className="load-dialog">
                <h1>Welcome!</h1>
                <ImportFromFileBodyComponent onLoad={(cards, entries) => {
                    cardList = cards;
                    entryList = entries
                }}></ImportFromFileBodyComponent>
                <button className="load-button" onClick={() => verifyAndLoad(props)}> Start</button>
            </div>
            <div className="pleco-descripion">
                About Pleco<br/><br/>
                It is crucial to export the Pleco database backup in the right file format. <br/><br/>
                For doing so go to Export >> Export Cards <br/><br/>
                Export with the following settings: <br/><br/>
                <li>Card Selection, your choice - depends on what you want to revise</li>
                <li>File Format, Text File</li>
                <li>Text-Encoding, UTF8</li>
                <li>Character set, simplified</li>
                <li>Include Data, uncheck all fields apart from the "Don't include examples" field has to be checked
                </li>
            </div>
        </div>
    );
}

// Adapted from ilonacodes's blog
const ImportFromFileBodyComponent = (props) => {
    let fileReader;
    const handleFileRead = (e) => {
        var lines = fileReader.result.split('\n');
        let checkForUniqueHanzi = new Set();
        let cardList = [];
        let entryList = [];

        for (var line = 0; line < lines.length; line++) {
            if (!lines[line]) {
                continue;
            }
            const currentLine = lines[line].replace(/\/\/|\.|…/g, ""); //TODO remove latin characters from hanzi and non-letters from pinyin
            const fields = currentLine.split('\t');

            //1: Store complete row as entry (providing it is a word or sentence)
            if (fields[0].length > 1) {
                entryList.push(new Entry(fields[0], fields[1]))
            }

            //2: Split up to separate hanzi/pinyin pairs
            const hanziList = fields[0].split("");

            for (var i = 0; i < hanziList.length; i++) {
                const hanzi = hanziList[i];
                // TODO add pinyin from pleco dict but with tones in the syllable
                // var pinyinList = fields[1].split(/(\d)/);
                // pinyinList.pop();
                // const sylables = pinyinList[i*2];
                // const tone = pinyinList[i*2+1];
                var pinyin = require("chinese-to-pinyin");
                const sylables = pinyin(hanzi);
                const tone = pinyin(hanzi, {toneToNumberOnly: true});

                if (hanzi && !checkForUniqueHanzi.has(hanzi)) {
                    console.log(hanzi + "\t" + sylables + "\t" + tone);
                    cardList.push(new Card(hanzi, sylables, tone));
                    checkForUniqueHanzi.add(hanzi);
                }
            }
        }
        props.onLoad(cardList, entryList);
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    return <div>
        <input type='file'
               id='file'
               className='input-file'
               accept='.txt'
               onChange={e => handleFileChosen(e.target.files[0])}
        />
    </div>;
};


