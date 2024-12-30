
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
    const placeId = getPlaceIdFromUrl(tabURL)
    //API endpoint to get the games icon/thumbnail
    const thumbnailDataFetchURL = `https://www.roblox.com/item-thumbnails?params=[{assetId:${placeId},imageSize:"small"}]`
    //API endpoint to get more general info on the game
    const getUniverseIDWithPlaceIDURL = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`

    // Fetching game icon and setting poopup HTML elements
    try {
        // Icon/Thumbnail
        const gameIconResponse = await fetch(thumbnailDataFetchURL);
        const gameIconJSON = await gameIconResponse.json();

        const thumbnailData = gameIconJSON[0].thumbnailUrl

        // General Info
        const universeIDResponse = await fetch(getUniverseIDWithPlaceIDURL);
        const universeIDJSON = await universeIDResponse.json();
        const universeID = universeIDJSON.universeId;

        const universeDataResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeID}`);
        const universeJSON = await universeDataResponse.json();
        console.log(universeJSON)
        const rootPlaceName = universeJSON.data[0].sourceName

        if (!universeIDResponse.ok) 
        {
            throw new Error(`Response status: ${universeIDResponse.status}`);
        }
        else
        {
            gameThumbnail.src = thumbnailData 
            gameName.innerHTML = rootPlaceName
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

