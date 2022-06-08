const API_KET = '0e950df7b3ae87cab30e5769fe005eeb';
const BASE_PATH ="https://api.themoviedb.org/3";

interface IMovie {
    id : number;
    backdrop_path : string;
    poster_path : string;
    title : string;
    release_date : string;
    overview : string;
    original_title : string;
    original_language: string;
    vote_average : number;
    media_type : string;
    name : string;
    known_for : [];
}


export interface IGetMovieResult {
    dates : {
        maximum : string;
        minimum : string;
    }
    page :number;
    results :IMovie[];
    total_pages :number;
    total_results : number;
}
export interface IDetailMovie {
    page :number;
    results : IMovie[];
    overview : string;
    original_title : string;
    media_type: string;
}


export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KET}&language=ko`).then(
        response => response.json());
}
export function getOnAirShows() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KET}&language=ko`).then(
        response => response.json());
}

export function getTvShows() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KET}&language=ko`).then(
        response => response.json());
}

export function getTopTvShows() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KET}&language=ko`).then(
        response => response.json());
}

export function getDetailMovie(title:string) {
    return fetch(`${BASE_PATH}/search/multi?api_key=${API_KET}&language=ko&query=${title}`).then(
        response => response.json());
}