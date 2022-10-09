export const mixTextOverflow = (text: string, length: number) => {
    if (text.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= length) {
        return text;
    } else {
        let _length = 0;
        let outputText = '';
        for (let i = 0; i < text.length; i++) {
            if (/[\u4e00-\u9fa5]/.test(text[i])) {
                _length += 2;
            } else {
                _length += 1;
            }
            if (_length > length) {
                break;
            } else {
                outputText += text[i];
            }
        }
        return outputText;
    }
};