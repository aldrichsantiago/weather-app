import { useState } from 'react'
import { capitalizeFirstLetter, formatInputString } from './helpers';

function App() {
  const [city, setCity] = useState('')
  const [countrySelect, setCountrySelect] = useState('')
  const [name, setName] = useState('')
  const [cityState, setCityState] = useState('')
  const [country, setCountry] = useState('')
  const [iconSrc, setIconSrc] = useState(`https://openweathermap.org/img/wn/04d@2x.png`)
  const [description, setDescription] = useState('')
  const [temp, setTemp] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  
  const computeTemp = (weatherData) => {
    setTemp((weatherData.main.temp - 273.15).toFixed(2))
  }

  const getDescription = (weatherData) => {
    const { weather } = weatherData;
    let icon = weather[0].icon
    setDescription(capitalizeFirstLetter(weather[0].description))
    setIconSrc(`https://openweathermap.org/img/wn/${icon?icon:'04d'}@2x.png`)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    let cityName = formatInputString(city)

    try {
      const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countrySelect}&limit=1&appid=${import.meta.env.VITE_API_KEY}`)
      const geoResponseData = await geoResponse.json();
      if (geoResponseData.length === 0) {
        alert("There is no city with that name.");
        setIsLoading(false)
        return;
      }
      // console.log(geoResponseData);
      let lon = geoResponseData[0].lon
      let lat = geoResponseData[0].lat
      cityName = geoResponseData[0].name
      setCountry(geoResponseData[0].country)
      setCityState(geoResponseData[0].state)

      try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}`)
        const weatherResponseData = await weatherResponse.json();
        // console.log(weatherResponseData);
        computeTemp(weatherResponseData);
        setName(weatherResponseData.name)
        getDescription(weatherResponseData);

      } catch (error) {
        console.log(error);
        alert("An Error Occured");
        setIsLoading(false)
        return;
      }
    } catch (error) {
      console.log(error);
      alert("An Error Occured");
      setIsLoading(false)
      return;
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className="w-full h-screen p-12 flex flex-col items-center bg-neutral-800">
        <h1 className="text-6xl font-extrabold text-white">
          🌦️ Weather Application 🌦️
        </h1>


        <form method="get" className='w-full flex items-center justify-center' onSubmit={handleSubmit}>
          <select className='text-2xl font-bold' name="countrySelect" id="countrySelect" onChange={(e)=>{setCountrySelect(e.target.value); console.log(e.target.value)}}>
            <option value="" defaultChecked></option>
            <option value="PH">PH</option>
            <option value="US">US</option>
            <option value="GB">GB</option>
            <option value="JP">JP</option>
          </select>

          <input type="text" name='city' placeholder='Enter a city name'
          className='py-1 px-3 m-12 text-3xl font-medium rounded-xl' 
          onChange={(e)=>setCity(e.target.value)}
          />

          <button className='py-2 px-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>

          </button>
        </form>
        

        <div className="w-full sm:w-1/3 h-96 p-5 m-12 text-center rounded-xl bg-neutral-300 shadow-xl">

          { 
            isLoading ? 
            <p className='text-7xl font-medium'>
              Loading
            </p>
            :
            <>
              <p className='text-4xl font-medium transition-all'>{name}, {cityState}</p>
              <p className='text-xl font-medium transition-all'>{country}</p>
              <div className="m-4 flex flex-col items-center transition-all">
                <p className='text-3xl tracking-tight font-medium transition-all'>{description}</p>
                <img src={iconSrc} alt="WeatherIcon" />
                <p className='text-6xl font-medium transition-all'>
                  {temp.toString() + "°C"}
                </p>
              </div>
            </>
          }
          
          
         
        </div>



      </div>
    </>
  )
}

export default App
