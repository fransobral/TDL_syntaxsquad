type MovieProps = {
    movie: string
    deleteMovie: () => void
}

const Movie = ({ movie, deleteMovie }: MovieProps) => {
    return (
        <div className="task">
            <span>{movie}</span>
            <button onClick={deleteMovie} > Delete </button>
        </div>
    )
}

export default Movie