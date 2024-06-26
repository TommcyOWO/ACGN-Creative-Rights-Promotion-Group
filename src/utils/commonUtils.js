import exp from "constants";

export const parseCookies = () => {
    const { cookie } = document;
    return cookie.split(';').reduce((result, item) => {
        const [k, v] = item.trim().split('=');
        return { ...result, [decodeURIComponent(k)]: decodeURIComponent(v) };
    }, {});
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const timestampFormat = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}.${month}.${day}`;
};

export const replyTagCheck = (text) => {
    const textCheck = text.split(' ');
    if (textCheck.length < 1) {
        return false;
    }
    if (textCheck[0].length < 1) {
        return false;
    }
    if (textCheck[0][0] === '@') {
        return true;
    }
}