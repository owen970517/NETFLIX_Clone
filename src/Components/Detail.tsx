import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getDetailMovies, getDetailTvShows, IGetMoviesDetail } from "../api";
import styled from 'styled-components'
import { makeImagePath } from "../Utilis";
interface RouteParams {
    movieId: number;
    tvId: number;
}
const CompanyLogo = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  width: 50px;
  height: 50px;
  margin: 5px 0px;
`;

const Title = styled.h1`
    text-align: center;
    font-size : 30px;
    margin-bottom : 10px;
`
const Genre = styled.div`
    display : flex;
    justify-content : space-around;
    align-items : center;
`
const Summary = styled.h1`
    padding : 10px;
`
const CompanyInfo = styled.div`
    display : flex;
    justify-content : space-around;
    align-items : center;
`

function Detail() {
    const { movieId,tvId } = useParams() ;
    const {data , isLoading} = useQuery<IGetMoviesDetail>(['detail'] ,  () => (movieId ? getDetailMovies(+movieId) : getDetailTvShows(tvId as any)))
    console.log(movieId);
    console.log(tvId);
    console.log(data);
    return (
        <div>
            <Title>장르</Title>
            <Genre>{data?.genres.map((genre) => <h1>{genre.name}</h1>)}</Genre>
            <Title>줄거리</Title>
            <Summary>{data?.overview}</Summary>
            <Title>제작사</Title>
            <CompanyInfo>
            {data && data?.production_companies.map((company) =>
                <CompanyLogo bgPhoto={ company.logo_path= makeImagePath(company.logo_path, 'w500')}></CompanyLogo>
            )}</CompanyInfo>
        </div>
    )
}

export default Detail