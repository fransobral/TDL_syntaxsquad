import { useState } from "react";

const MovieApp = () => {
  const [searchMovie, setSearchMovie] = useState<string>('')
  const [listMovie, setListMovie] = useState<string[]>([])

  const handleAddMovie = () => {

  }

  return (
    <div>
      <h1>MovieApp - Search Movie</h1>
      <input
        type="text"
        value={searchMovie}
        onChange={(e) => setSearchMovie(e.target.value)}
        placeholder="Movie"
      />
      <button onClick={handleAddMovie}></button>
    </div>
  )
}

export default MovieApp