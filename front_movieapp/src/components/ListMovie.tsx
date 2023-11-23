import Movie from "./Movie"

type ListMoviesProps = {
    listMovies: string[]
    deleteMovie: (index: number) => void
}

const ListMovie = ({ listMovies, deleteMovie }: ListMoviesProps) => {
    return (
        <div className="taskList">
            {listMovies.map((movie, index) => (
                <Movie key={index} movie={movie} deleteMovie={() => deleteMovie}></Movie>
            )
            )}
        </div>
    )
}

export default ListMovie