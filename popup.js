
// Gets popup HTML elements for preperation (We'll be filling these in with data from the games page itself)
const gameThumbnail = document.getElementById("gameThumbnail");
const gameName = document.getElementById("gameName");

// Gets general roblox game information
    // (Directly set the above variables to these? Or get the page variables second THEN set the elemtnts?)

function getPlaceIdFromUrl(url) {
    const regex = /\/games\/(\d+)/;
    const match = url.match(regex);
    return match && match[1];
};

async function currentTabCallback(tabs) {
    const tabURL = tabs[0].url;
    const gameId = getPlaceIdFromUrl(tabURL)
    const assetFetchURL = `https://www.roblox.com/item-thumbnails?params=[{assetId:${gameId},imageSize:"small"}]`

    console.log(`Fetching Image URL...`)

    // Fetch Game Icon
    try {
        const response = await fetch(assetFetchURL);
        const jsonData = await response.json();
        const thumbnailData = jsonData[0].thumbnailUrl
        const nameData = jsonData[0].name

        console.log(jsonData)

        if (!response.ok) 
        {
            throw new Error(`Response status: ${response.status}`);
        }
        else
        {
            gameThumbnail.src = thumbnailData 
            gameName.innerHTML = nameData
        }
    } 
    catch (error) {
        console.error(error.message)
    }
};


(() => {
    console.log("Init: popup.js")

    if (!gameThumbnail && !gameName)
    {
        throw new Error(`Game Thumbnail or Game Name Elements do not exsist`)
    }
    else{
        chrome.tabs.query(
            { active: true, currentWindow: true }, 
            currentTabCallback
        );
    }
})();

