

const inputBox = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const searchSuggestion = document.querySelector('.search-suggestion-container');
const loadingText = document.querySelector('#loadingText');
const movieContainer = document.querySelector('.movie-container');

inputBox.oninput = (event) => {
     if(inputBox.value.length){
          fetch(`http://omdbapi.com/?s=${event.target.value}&page=1&apikey=437ef720`)
          .then((res) => {
               return res.json()
          })
          .then((data) => {
               let searchdata = data.Search.map((item) => {
                    let allTitle = item.Title;
                    return allTitle;
               })

               let titles = new Array(searchdata)
               let all = []
               all = titles[0].filter((t) => {
                    return t.toLowerCase().includes(inputBox.value.toLowerCase())
               })

               showTitles(all)
          })
     }
     else if(event.target.value.length == 0){
          searchSuggestion.classList.remove('active-search-suggestion');
          loadingText.innerHTML = ""
          movieContainer.innerHTML = ""
          searchSuggestion.innerHTML = ""
     }
}

const showTitles = (result) => {
     let content = result.map((keyword) => {
          return `<li onclick=selectMovie(this)> ${keyword} </li>`
     })
     searchSuggestion.classList.add('active-search-suggestion');
     searchSuggestion.innerHTML = `<ul> ${content.join('')} </ul>`
}


const selectMovie = (movie) => {
     inputBox.value = movie.innerText;
     searchSuggestion.innerHTML = ""
     movieContainer.innerHTML = ""
     getMovie(inputBox.value)
}

const getMovie = async (userMovie) => {
     try{
          const res  = await fetch(`http://www.omdbapi.com/?t=${userMovie}&apikey=437ef720`)
          const data = await res.json()
          showMovie(data,userMovie);
     }
     catch{
          loadingText.innerHTML = '<h3 id="loadingText">Server not responding? Please check your internet connection and try again</h3>'
     }
}

const showMovie = (moviedata,userMovie) => {
     let movieType = moviedata.Type === "series" ? "Series" : "Movie"

     if(moviedata.Error === "Movie not found!"){
          loadingText.innerHTML = `Finding ${movieType} "${userMovie}"`
          setTimeout(() => {
               loadingText.innerHTML = 'Sorry, this movie is not found in our database?'
          }, 3000);
     }
     else{
          // const rex = Math.floor(Math.random() * 16777215)
          // const hexCode = "#" + rex.toString(16);

          loadingText.innerHTML = `Finding ${movieType} "${userMovie}"`
          setTimeout(() => {
               loadingText.innerHTML = `Search Result for "${moviedata.Title}"`
               // const root = document.documentElement;
               // const currentColor = getComputedStyle(root).getPropertyValue('--primary');
               // root.style.setProperty('--primary',`${hexCode}`);
               movieContainer.innerHTML = `
                <div class="movie-card">
                <div class="movie-poster">
                    <img src=${moviedata.Poster}>
                </div>
                <div class="movie-content">
                    <h1 id='title'>${moviedata.Title}</h1>
                    <div id='rating'>
                      <h2>${moviedata.imdbRating}</h2>
                      <i class="ri-star-fill"></i>
                    </div>
                    <div id='genre'>

                    </div>
                    <p id='country'>Country - ${moviedata.Country}</p>
                    <p id='actors'>Actors - ${moviedata.Actors}</p>
                    <p id='storyline'>Storyline - ${moviedata.Plot}</p>
                </div>
                </div>
               `

               const genrecontainer = document.querySelector('#genre');
               const genre = moviedata.Genre;
               genre.split(',').forEach((genre) => {
                    const spanEl = document.createElement('span')
                    spanEl.innerHTML = genre;
                    genrecontainer.appendChild(spanEl)
               })
               
          }, 3000);
     }
}

searchBtn.addEventListener('click',() => {
     if(!inputBox.value == ''){
          getMovie(inputBox.value)
          searchSuggestion.innerHTML = ""
     }
     else{
          alert('Please enter your favourite movie?')
     }
})

document.addEventListener('keyup',(event) => {
     if(event.key === "Enter"){
          searchBtn.click()
          searchSuggestion.innerHTML = ""
     }
})
