import { editableInputTypes } from "@testing-library/user-event/dist/utils"
import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import { useMatch, useNavigate ,PathMatch} from "react-router-dom"
import styled from "styled-components"
import { getMovies, IGetMovieResult} from "../api"
import { makeImagePath } from "../Utilis"

const Wrapper = styled.div`
    background-color : black;

`
const Loader = styled.div` 
    height : 20vh;
    text-align : center;
    display : flex;
    justify-content :center;
    align-items : center;
`
const Banner = styled.div<{bgPhoto : string}>`
    height : 100vh;
    display :flex;
    flex-direction : column;
    justify-content : center;
    padding : 60px;
    background-image : linear-gradient(rgba(0,0,0,0) , rgba(0,0,0,1)),url(${props => props.bgPhoto});
    background-size : cover;
`
const Title = styled.h2`
    font-size : 50px;
    margin-bottom:20px;
`
const Overview = styled.p`
    font-size : 16px;
    width : 50%;
`
const Date = styled.h3`
    font-size : 20px;
    margin-bottom : 20px;
`
const Slider = styled.div`
    position:relative;
    top : -100px;
`
const TvSlider = styled.div`
    margin-top : 20px;
`
const Row = styled(motion.div)`
    display : grid;
    grid-template-columns : repeat(6,1fr);
    gap:10px;
    position:absolute;
    width : 100%;
`
const Box = styled(motion.div)<{bgPhoto : string}>`
    background-color : white;
    height:200px;
    background-image : url(${props => props.bgPhoto} );
    background-size :cover;
    background-position :center;
    &:first-child {
        transform-origin : center left;
    }
    &:last-child {
        transform-origin : center right;
    }
`
const rowVar = {
    hidden :{
        x : window.outerWidth+10,
    },
    visible : {
        x:0,
    },
    exit : {
        x : -window.outerWidth-10,
    }
}

const Info = styled(motion.div)`
    padding :10px;
    background-color : ${props => props.theme.black.lighter};
    opacity :0;
    position :absolute;
    width : 100%;
    bottom : 0;
    h4 {
        text-align : center;
        font-size : 18px;
    }
`

const Overlay = styled(motion.div)`
    position :fixed;
    opacity : 0;
    top : 0;
    width :100%;
    height :100%;
    background-color : rgba(0,0,0,0.5);
`
const BigMovie = styled(motion.div)`
    position :absolute;
    width :40vw;
    height :80vh;
    backgroundColor : 'whitesmoke' ;
    left :0 ;
    right :0;
    margin : 0 auto;
    background-color : ${props => props.theme.black.lighter};
    overflow:hidden;
    border-radius : 20px;
`

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 300px;
`

const BigTitle = styled.h2`
    color : ${props => props.theme.white.lighter};
    text-align:center;
    font-size : 28px;
`
const offset =6;
const boxVar = {
    normal : {
        scale : 1,
    },
    hover : {
        scale :1.5,
        y : -70,
        transition : {
            delay : 0.5,
            type : 'tween',
        }
    }
}
const infoVar ={
    hover : {
        opacity : 1,
        transition : {
            delay : 0.5,
            type : 'tween',
        }
    }
}

function Home() {
    const navigate = useNavigate();
    const {scrollY} = useViewportScroll();
    const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:id");
    console.log(moviePathMatch);
    const {data:MovieData , isLoading:MovieLoading} = useQuery<IGetMovieResult>(['movies' , 'now_playing'] , getMovies);
    console.log(MovieData);
    const [index,setIndex] = useState(0)
    const [leaving ,setLeaving] = useState(false);
    const IncreaseIndex = () => {
        if(MovieData) {
            if(leaving) return
            toggleLeaving();
            const totalMovies = MovieData.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset)-1;
            setIndex((prev) => prev ===maxIndex ? 0 : prev+1);
        }
    };
    const toggleLeaving = () => {
        setLeaving(prev=>!prev);
    }
    const onBoxClick = (movieId :number) => {
        navigate(`/movies/${movieId}`)
    }
    const onOverlayClick = () => {
        navigate('/')
    }
    const MovieClick = moviePathMatch?.params.id && MovieData?.results.find(movie => String(movie.id) === moviePathMatch.params.id);
    console.log(MovieClick);
    return (
        <Wrapper>
            {
            MovieLoading ? <Loader>Loading...</Loader> :
             <>
             <Banner onClick={IncreaseIndex} bgPhoto ={makeImagePath(MovieData?.results[0].backdrop_path || "")}>
                <Title>{MovieData?.results[0].title}</Title> 
                <Date>{MovieData?.dates.minimum.slice(0,4)} | {MovieData?.results[0].vote_average}</Date>
                    <Overview>
                        {MovieData?.results[0].overview}
                    </Overview>
            </Banner>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row variants={rowVar} transition={{type:"tween",duration : 1}} initial="hidden" animate="visible" exit='exit' key={index}>
                        {MovieData?.results.slice(1).slice(offset*index , offset*index + offset).map(movie=> 
                        <Box layoutId={movie.id+""} onClick={ ()=> onBoxClick(movie.id)} variants={boxVar} transition ={{type : 'tween'}} initial="normal" whileHover="hover" key={movie.id} bgPhoto ={makeImagePath(movie.backdrop_path , "w500")}>
                            <Info variants={infoVar}><h4>{movie.title}</h4></Info>
                        </Box>)}
                    </Row>
                </AnimatePresence>
            </Slider>
            <AnimatePresence>
                { moviePathMatch ? 
                    (<>
                        <Overlay onClick={onOverlayClick} exit={{opacity : 0}} animate={{opacity : 1}}/>
                        <BigMovie style={{ top : scrollY.get()+100}} layoutId={moviePathMatch.params.id}>
                            {MovieClick && <>
                                <BigCover style={{backgroundImage : `url(${makeImagePath(MovieClick.backdrop_path,"w500")})`}} ></BigCover>
                                <BigTitle>{MovieClick.title}</BigTitle>
                                <p>{MovieClick.overview}</p>
                            </>}
                        </BigMovie>
                    </>) : 
                    null}
                </AnimatePresence>
            </>
            }
        </Wrapper>
    )
}

export default Home