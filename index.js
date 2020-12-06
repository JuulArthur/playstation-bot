const fetch = require('node-fetch')

const komplettPages = ['https://www.komplett.no/product/1111557/gaming/playstation/playstation-5', 'https://www.komplett.no/product/1161553/gaming/playstation/playstation-5-digital-edition'];
const elkjopPages = ['https://www.elkjop.no/product/gaming/spillkonsoll/playstation-konsoller/220280/playstation-5-ps5-digital-edition', 'https://www.elkjop.no/product/gaming/spillkonsoll/playstation-konsoller/220276/playstation-5-ps5'];
const powerPages = ['https://www.power.no/umbraco/api/product/getproductsbyids?ids=1101680', 'https://www.power.no/umbraco/api/product/getproductsbyids?ids=1077687'];
const kjellPages = ['https://www.kjell.com/no/produkter/lyd-og-bilde/dataspill-og-gaming/playstation-5/sony-playstation-5-spillkonsol-p62770', 'https://www.kjell.com/no/produkter/lyd-og-bilde/dataspill-og-gaming/playstation-5/sony-playstation-5-digital-edition-spillkonsol-p62771'];
const coopPages = ['https://coop.no/obs/brand/playstation/'];
const proshopPages = ['https://www.proshop.no/Spillkonsoll/Sony-PlayStation-5/2831713', 'https://www.proshop.no/Spillkonsoll/Sony-PlayStation-5-Digital-Edition/2863627'];

const getTextFromWebsite = async (url) => {
    const result = await fetch(url);
    return await result.text();
}

const textDoesNotExist = (text, keyword) => {
    return text.indexOf(keyword) === -1;
}

const checkWebsite = async (keyword, urls, store, debug) => {
    for (let url of urls) {
        const text = await getTextFromWebsite(url)
        if (debug) {
            console.log('text', text);
        }
        if (textDoesNotExist(text, keyword)) {
            console.log(`Løp å kjøp på ${store}`);
        } else {
            console.log(`Den er ikke klar enda på ${store}`);
        }
    }
}

const checkKomplett = async () => {
    await checkWebsite('Motta varsel', komplettPages, 'Komplett');
}

const checkElkjop = async () => {
    await checkWebsite('Ikke tilgjengelig', elkjopPages, 'Elkjop');
}

const checkPower = async () => {
    for (let url of powerPages) {
        const result = await fetch(url);
        const textResult = await result.text();
        const jsonResult = JSON.parse(textResult);
        if (jsonResult.ClickNCollectStoreCount > 0 || jsonResult.StockCount > 0) {
            console.log(`Løp å kjøp på Power, ClickNCollectStoreCount: ${jsonResult.ClickNCollectStoreCount}, StockCount: ${jsonResult.StockCount}`);
        } else {
            console.log(`Den er ikke klar enda på Power`);
        }
    }
}

const checkCoop = async () => {
    await checkWebsite('PS5 er utsolgt', coopPages, 'Coop');
}

const checkKjell = async () => {
    await checkWebsite('Kan ikke bestilles ennå', kjellPages, 'Kjell & Kompani');
}

const checkProshop = async () => {
    await checkWebsite('Vi tar for øyeblikket ikke imot flere forhåndsbestillinger', proshopPages, 'Proshop');
}

const main = async () => {
    try {
        await checkKomplett();
        await checkElkjop();
        await checkPower();
        await checkKjell();
        await checkCoop();
        await checkProshop();

        process.exit();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

main().then();