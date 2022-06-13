import { useQuery } from "react-query";
import {  useParams } from "react-router-dom"
import { getSearch, IDetailMovie } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../Utilis";
import { useState } from "react";
import Filter from "../Components/Filter";

interface SearchProps {
    search: string;
  }

let offset : 6;

const Slider = styled.div`
    position:relative;
    top : -100px;
`

function Search() {
    const params = useParams();
    console.log(params.title);
    const {data , isLoading} = useQuery<IDetailMovie>(['search'] , () => getSearch(params.title as any));
    console.log(data);
    return (
       <div>
           {isLoading ? 
           <Loader>
               <h1>Loading...</h1>
           </Loader> : 
            <>
            <Box>
                <Title>Tv 컨텐츠</Title>
            </Box>
                <Grid>
                    {data?.results.map(movie => 
                        movie.media_type === 'tv' &&
                        (
                            <Video key={movie.id}>
                                <BgImg style={{backgroundImage : movie.backdrop_path ? `url(${makeImagePath(movie.backdrop_path,"w500")})` : `url(${makeImagePath(movie.poster_path,"w500")})`}}></BgImg>
                                <h3>{movie.title ? movie.title : movie.name}</h3>
                            </Video>
                        )
                    )
                    }
                </Grid>
                <MvBox>
                    <Title>Movie 컨텐츠</Title>
                </MvBox>
                <Grid>
                    {data?.results.map(movie => 
                        movie.media_type === 'movie' &&
                        (
                            <Video key={movie.id}>
                                <BgImg style={{backgroundImage : movie.backdrop_path ? `url(${makeImagePath(movie.backdrop_path,"w500")})` : `url(${makeImagePath(movie.poster_path,"w500")})`}}></BgImg>
                                <h3>{movie.title ? movie.title : movie.name}</h3>
                            </Video>
                        )
                    )
                    }
                </Grid>
            </>
        }
       </div>
    )
}

const Title = styled.h1 `
    font-size : 35px;
    padding :10px;
`

const Loader = styled.div` 
    height : 20vh;
    text-align : center;
    display : flex;
    justify-content :center;
    align-items : center;
`
const Grid = styled.div`
    margin-top : 20px;
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
const Box = styled.div`
    margin-top :60px;
`
const MvBox = styled.div`
    margin-top : 10px;
`
export default Search