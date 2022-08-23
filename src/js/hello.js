

const parse = (doc) => {
    const parsedStream = new DOMParser().parseFromString(doc, "application/xml");
    console.log(parsedStream);
    const items = parsedStream.querySelectorAll('item');
    console.log(items);
    const globalState = {};
    // items.forEach((item) => )
}

export default parse;