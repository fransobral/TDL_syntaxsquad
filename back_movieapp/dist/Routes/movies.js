"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_controller_1 = require("../controllers/movies_controller");
const router = (0, express_1.Router)();
router.get('/movies/name', movies_controller_1.getMovieByName);
router.get('/movies/actor', movies_controller_1.getMoviesByActor);
router.get('/movies/top_actor', movies_controller_1.getTopMoviesByActor);
router.get('/movies/year', movies_controller_1.getMoviesByYear);
router.get('/movies/top_year', movies_controller_1.getTopMoviesByYear);
router.get('/movies/nationality', movies_controller_1.getMoviesByNationality);
router.get('/movies/top_nationality', movies_controller_1.getTopMoviesByNationality);
router.get('/movies/genre', movies_controller_1.getMoviesByGenre);
router.get('/movies/top_genre', movies_controller_1.getTopMoviesByGenre);
exports.default = router;
