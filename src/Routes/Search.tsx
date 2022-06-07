import { useQuery } from "react-query";
import { useLocation } from "react-router-dom"
import { getDetailMovie, IDetailMovie } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../Utilis";

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get('keyword');
    console.log(keyword);
    const {data , isLoading} = useQuery<IDetailMovie>(['detail'] , () => getDetailMovie(keyword as any));
    console.log(data);
    return (
       <div>
           {isLoading ? <Loader>
               <h1>Loading...</h1>
           </Loader> : 
           <Grid>
                {data?.results.map(movie => 
                <Video>
                    <BgImg style={{backgroundImage : movie.backdrop_path ? `url(${makeImagePath(movie.backdrop_path,"w500")})` : `url(${makeImagePath(movie.poster_path,"w500")})`}}></BgImg>
                    <h3>{movie.title ? movie.title : movie.name}</h3>
                    
                </Video>)}   
            </Grid>}
       </div>
    )
}

const Loader = styled.div` 
    height : 20vh;
    text-align : center;
    display : flex;
    justify-content :center;
    align-items : center;
`
const Grid = styled.div`
    margin-top : 60px;
    display : grid;
    grid-template-columns : repeat(auto-fit , minmax(20rem,1fr));
    grid-gap : 3rem;
`;
const Video = styled.div`
    img {
        width:100%;
        text-align : center;
        border-radius : 20px;
    }
    a {
        text-decoration : none;
    }
    h3 {
        text-align : center;
        padding : 20px;
    }
`;
const BgImg = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 300px;
`
export default Search