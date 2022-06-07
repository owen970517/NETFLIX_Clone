import { useQuery } from "react-query"
import { getTvShows} from "../api"
import styled from 'styled-components'
import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { makeImagePath } from "../Utilis";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
interface ITV {
    id : number;
    name : string;
    backdrop_path : string;
    poster_path : string;
    first_air_date:string;
    overview : string;
    vote_average : number;
}
interface IGetTvResult {
    page : number;
    results : ITV[];
    total_pages :number;
    total_results : number;
}
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
    font-size : 18px;
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
const Section = styled.div`
    margin-bottom : 20px;
    display : flex;
    justify-content : space-between;
    align-items : center;
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
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    &:first-child {
        transform-origin : center left;
    }
    &:last-child {
        transform-origin : center right;
    }
`
const rowVar = {
    hidden:(back:boolean) => ({
        x : back ? -window.outerWidth-10: window.outerWidth+10,
        opacity : 1
    }),
    visible : {
        x:0,
    },
    exit:(back:boolean) => ( {
        x : back ? window.outerWidth+10 : -window.outerWidth-10,
        opacity :0
    })
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

function Tv() {
    const navigate = useNavigate();
    const {data , isLoading} = useQuery<IGetTvResult>(['show' , 'popular'] , getTvShows);
    const [back,setBack] = useState(false);
    const [index,setIndex] = useState(0)
    const [leaving ,setLeaving] = useState(false);
    const NextIndex = () => {
        if(data) {
            if(leaving) return
            toggleLeaving();
            setBack(false);
            const totalMovies = data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset)-1;
            setIndex((prev) => prev ===maxIndex ? 0 : prev+1);
        }
    };
    const PrevIndex = () => {
        if(data) {
            if(leaving) return
            toggleLeaving();
            setBack(true);
            const totalMovies = data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset)-1;
            setIndex((prev) => prev === 0 ? maxIndex : prev-1);
        }
    };
    const toggleLeaving = () => {
        setLeaving(prev=>!prev);
    };
    const onBoxClick = (movieId :number) => {
        navigate(`/movies/${movieId}`)
    }
    const onOverlayClick = () => {
        navigate('/')
    }
    return (
        <Wrapper> { isLoading ? <Loader>Loading...</Loader> : 
        <>
            <Banner bgPhoto ={makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].name}</Title> 
                    <Date>{data?.results[0].first_air_date.slice(0,4)} | {data?.results[0].vote_average}</Date>
                        <Overview>
                            {data?.results[0].overview}
                        </Overview>
            </Banner>
            <Slider>
                <Section>
                    <h3>현재 방영중</h3>
                    <div>
                        <button onClick={PrevIndex}>left</button>
                        <button onClick={NextIndex}>right</button>
                    </div>
                </Section>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row variants={rowVar} transition={{type:"tween",duration : 1}} initial="hidden"  custom={back} animate="visible" exit='exit' key={index}>
                        {data?.results.slice(1).slice(offset*index , offset*index + offset).map(tv=> 
                        <Box layoutId={tv.id+""} onClick={ ()=> onBoxClick(tv.id)} variants={boxVar} transition ={{type : 'tween'}} initial="normal" whileHover="hover" key={tv.id} bgPhoto ={makeImagePath(tv.backdrop_path ? tv.backdrop_path : tv.poster_path, "w400")}>
                            <Info variants={infoVar}><h4>{tv.name}</h4></Info>
                        </Box>)}
                    </Row>
                </AnimatePresence>
            </Slider>
        </>}</Wrapper>
    )
}

export default Tv