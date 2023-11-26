import { useState } from "react";
import ListMovie from "./ListMovie";

const MovieApp = () => {
  const [searchMovie, setSearchMovie] = useState<string>('')
  const [listMovies, setListMovies] = useState<string[]>([])

  const handleAddMovie = () => {
    if (searchMovie.trim() === '') return
    setListMovies(previousMovies => [...previousMovies, searchMovie])
    console.log(listMovies)
    setSearchMovie('')
  }

  const handleDeleteMovie = (index: number) => {
    setListMovies(movie => movie.filter((_, i) => i !== index))
  }

return (
  <div>
    <div>
      <h1>MovieApp - Search Movie</h1>
      <input
        type="text"
        value={searchMovie}
        onChange={(e) => setSearchMovie(e.target.value)}
        placeholder="Movie"
      />
      <button onClick={handleAddMovie}>Add Movie</button>
    </div>
    <ListMovie listMovies={listMovies} deleteMovie={handleDeleteMovie}></ListMovie>
  </div>
)
}

export default MovieApp