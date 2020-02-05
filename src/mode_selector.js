export default class ModeSelector {
    constructor(mode) {
        //TODO implement switching depending on mode
        this.mode = mode;
    }

    getAnswerField(card) {
        return card.pinyin;
    }

    getQuestionField(card) {
        return card.hanzi;
    }
}


