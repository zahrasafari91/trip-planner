import React, { useState } from 'react';
import Particles from 'react-particles-js';




const weatherApi = {
  key: "03d31582076669924624ef991bfd6113",
  base: "https://api.openweathermap.org/data/2.5/"
 
}





// react particles

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
      enable: true,
      },
      number: { value: 100, density: { enable: true, value_are:100} },
    color: { value: "#cbe8f2" },
    }
  }
}



function App() {


// search query for searching both weather and wikipedia api
  const [query, setQuery] = useState('');

  const [weather, setWeather] = useState({});

	const [wikipedia, setWikipedia] = useState([]);


//get weather
  const searchWeather = e => {
    if (e.key === "Enter") {

      fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}`)

      
        .then(res => res.json())
        .then(result => {


          if(result.cod === 404){
            const error = new Error();
            error.message = 'city not found';
            throw error;}



          else{

          setWeather(result);
          setQuery('');}



          console.log(result);
        });}
  }

 

//get Date
  const dateBuilder = (d) => {

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();



    return `${day} ${date} ${month} ${year}`
  }


//get wikipedia info
  const searchWikipedia = async e => {


		e.preventDefault();
		if (query === '') return;
		
		const wikiApi = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;

		const response = await fetch(wikiApi);


		if (!response.ok) {
			throw Error(response.statusText);
		}

		const json = await response.json();
		setWikipedia(json.query.search);
		
	}






  return (
    
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 14) ? 'app warm' : 'app') : 'app'}>

 


        <main>
            
            {/* weather elements */}

            
            <div className="weather-container">
            

              <div className="weather-search-box">


                  <input 
                    type="text"
                    className="weather-search-bar"
                    placeholder="Search..."
                    onChange={e => setQuery(e.target.value)}
                    value={query}
                    onKeyPress={searchWeather}/>



              </div>


             {(typeof weather.main != "undefined") ? (


                <div>
                    <div className="location-box">



                      <div className="location">{weather.name}, {weather.sys.country}</div>
                      
                      
                      <div className="date">{dateBuilder(new Date())}</div>



                    </div>
          



                      <div className="weather-box">



                        <div className="weather-icon">
                          <img className="img" src= {`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="weather icon"/>
                       </div>




                      <div className="temp">
                        {Math.round(weather.main.temp)}°c
                      </div>
              




                      <div className="weather">
                          {weather.weather[0].description}
                      </div>



                    </div>
                  </div>


                  ) : (<p className="message">Please enter a city name to get its weather</p>)}
              </div>

        </main>
       

      
        {/* particles  elements */}


        <div>
         <Particles className = 'particles' params={particlesOptions}/>              
        </div>
     
        




        {/* wikipedia elements */}    
        
         
        <div className="wiki">
      
      
          <div>

          <h1>would you like to know more about this city</h1>



			  	<form className="search-box-wiki" onSubmit={searchWikipedia}>


					  <input type="search" placeholder="Search here"  
              onChange={e => setQuery(e.target.value)}
              value={query} />




				  </form>
				
          </div>

      
			    <div className="wiki-results">



			    	{wikipedia.map((result) => {
					  const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
					  
            
            return (
						  <div className="wiki-result">


							  <h3>{result.title}</h3>


						  	<p dangerouslySetInnerHTML={{ __html: result.snippet }}></p>


							  <a href={url} target="blank">Read more</a>
					  	</div>
				  	)


				    })}
			    </div>
      
        </div>

   
    </div>
  );
}

export default App;






