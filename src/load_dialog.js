import React from "react";
import Entry from "./entry";

export default function LoadDialog(props) {
    var entryList;

    function verifyAndLoad(props) {
        if(!entryList) {
            // TODO load HSK levels as default
            entryList = [
                new Entry("水", "shuǐ", "water"),
                new Entry("风", "fēng", "wind"),
                new Entry("火", "huǒ", "fire"),
                new Entry("土", "tŭ", "earth")
            ];
        }
        props.loadData(entryList);
    }

    return (
        <div className="load-dialog">
            <h1>Welcome!</h1>
            <ImportFromFileBodyComponent onLoad={(entries) => entryList = entries}></ImportFromFileBodyComponent>
            <button className="load-button" onClick={() => verifyAndLoad(props)}> Parse Pleco dictionary</button>
        </div>);
}

// Adapted from ilonacodes's blog
const ImportFromFileBodyComponent = (props) => {
    let fileReader;
    const handleFileRead = (e) => {
        var lines = fileReader.result.split('\n');
        let checkForUniqueHanzi = new Set();
        let entryList = [];

        for (var line = 0; line < lines.length; line++) {
            if (!lines[line]) {
                continue;
            }
            const currentLine = lines[line].replace(/\/\/|\.|…/g, ""); //TODO remove latin characters from hanzi and non-letters from pinyin
            const fields = currentLine.split('\t');
            const hanziList = fields[0].split("");

            for (var i = 0; i < hanziList.length; i++) {
                const hanzi = hanziList[i];
                // TODO add pinyin from pleco dict but with tones in the syllable
                // var pinyinList = fields[1].split(/(\d)/);
                // pinyinList.pop();
                // const sylables = pinyinList[i*2];
                // const tone = pinyinList[i*2+1];
                var pinyin = require("chinese-to-pinyin")
                const sylables = pinyin(hanzi);
                const tone = pinyin(hanzi, {toneToNumberOnly: true});

                if (hanzi && !checkForUniqueHanzi.has(hanzi)) {
                    console.log(hanzi + "\t" + sylables + "\t" + tone);
                    entryList.push(new Entry(hanzi, sylables, tone));
                    checkForUniqueHanzi.add(hanzi);
                }
            }
        }
        props.onLoad(entryList);
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


