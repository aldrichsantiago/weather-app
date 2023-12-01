const removeSpaces = (e) => {
    if(e === " " || e === ""){ /* empty */ } 
    return e;
}

export const capitalizeFirstLetter = (e) => {
    return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}

 export const formatInputString = (city) => {
    // manilA ==> Manila;   san leonardo ==> San+Leonardo
    city = city.trim();
    let cityArr = city.split(" ");
    cityArr = cityArr.filter(removeSpaces);
    cityArr = cityArr.map(capitalizeFirstLetter);
    city = cityArr.join("+");
    console.log(city);
    return city;
}