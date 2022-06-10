import { useQuery } from "react-query"
import { getOnAirShows, getSimilarTvShows, getTopTvShows, getTvShows} from "../api"
import styled from 'styled-components'
import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { makeImagePath } from "../Utilis";
import { useState } from "react";
import { Navigate, PathMatch, useMatch, useNavigate, useParams } from "react-router-dom";
import { GrNext,GrPrevious } from "react-icons/gr";
import Similar from "../Components/Similar";
import Detail from "../Components/Detail";

interface IGenres {
    id : number;
    name : string;
}

interface ITV {
    id : number;
    name : string;
    backdrop_path : string;
    poster_path : string;
    first_air_date:string;
    overview : string;
    vote_average : number;
    genres : IGenres[];
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
const TvSlider = styled.div`
    position:relative;
    top : 100px;
`
const Section = styled.div`
    padding : 10px;
    margin-bottom : 10px;
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
    left :0 ;
    right :0;
    margin : 0 auto;
    background-color : ${props => props.theme.black.lighter};
    overflow:auto;
    border-radius : 20px;
`

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 300px;
`;

const BigBox =  styled.div`
    display : flex;
    justify-content :space-between;
    align-items : center;
`

const BigTitle = styled.h2`
    color : ${props => props.theme.white.lighter};
    padding : 10px;
    font-size : 28px;
    position : relative;
    top : -50px;
`
const StarAvg = styled.h2`
    padding : 10px;
    font-size : 28px;
    position : relative;
    top : -50px;
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
    const {data:Tvshow , isLoading:TvLoading} = useQuery<IGetTvResult>(['show' , 'popular'] , getTvShows);
    const {data:Topshow , isLoading:TopTvLoading} = useQuery<IGetTvResult>(['show' , 'top'] , getTopTvShows);
    const {data:OnAir , isLoading:OnAirLoading} = useQuery<IGetTvResult>(['show' , 'on_air'] , getOnAirShows);
    const tvPathMatch: PathMatch<string> | null = useMatch("/tv/:id");
    const {scrollY} = useViewportScroll();
    const [back,setBack] = useState(false);
    const [index,setIndex] = useState(0)
    const [Topindex,setTopIndex] = useState(0)
    const [leaving ,setLeaving] = useState(false);
    const NextIndex = () => {
        if(Tvshow) {
            if(leaving) return
            toggleLeaving();
            setBack(false);
            const totalMovies = Tvshow.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset)-1;
            setIndex((prev) => prev ===maxIndex ? 0 : prev+1);
        }
    };
    const PrevIndex = () => {
        if(Tvshow) {
            if(leaving) return
            toggleLeaving();
            setBack(true);
            const totalMovies = Tvshow.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset)-1;
            setIndex((prev) => prev === 0 ? maxIndex : prev-1);
        }
    };
    const NextTvIndex = () => {
        if(Topshow) {
            if(leaving) return
            toggleLeaving();
            setBack(false);
            const totalPop = Topshow?.results.length-1;
            const maxIndex = Math.floor(totalPop / offset)-1;
            setTopIndex((prev) => prev === maxIndex ? 0 : prev+1);
        }
    };
    const PrevTvIndex = () => {
        if(Topshow) {
            if(leaving) return
            toggleLeaving();
            setBack(true);
            const totalMovies = Topshow.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset)-1;
            setTopIndex((prev) => prev === 0 ? maxIndex : prev-1);
        }
    };
    const toggleLeaving = () => {
        setLeaving(prev=>!prev);
    };
    const onBoxClick = (tvId :number) => {
        navigate(`/tv/${tvId}`);
    }
    const onOverlayClick = () => {
        navigate('/tv')
    }
    const ShowClick = (tvPathMatch?.params.id && Topshow?.results.find(tv => String(tv.id) === tvPathMatch.params.id)) || (tvPathMatch?.params.id && OnAir?.results.find(tv => String(tv.id) === tvPathMatch.params.id));
    console.log(ShowClick);
    return (
        <Wrapper> { TvLoading ? <Loader>Loading...</Loader> : 
        <>
            <Banner bgPhoto ={makeImagePath(OnAir?.results[0].backdrop_path || "")}>
                <Title>{OnAir?.results[0].name}</Title> 
                    <Date>{OnAir?.results[0].first_air_date.slice(0,4)} | {OnAir?.results[0].vote_average}</Date>
                        <Overview>
                            {OnAir?.results[0].overview}
                        </Overview>
            </Banner>
            <Slider>
                <Section>
                    <h3>현재 방영중</h3>
                    <div>
                        <button  onClick={PrevIndex}>&lt;</button>
                        <button onClick={NextIndex}>&gt;</button>
                    </div>
                </Section>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row variants={rowVar} transition={{type:"tween",duration : 1}} initial="hidden"  custom={back} animate="visible" exit='exit' key={index}>
                        {OnAir?.results.slice(1).slice(offset*index , offset*index + offset).map(tv=> 
                        <Box layoutId={tv.id+""} onClick={ ()=> onBoxClick(tv.id)} variants={boxVar} transition ={{type : 'tween'}} initial="normal" whileHover="hover" key={tv.id} bgPhoto ={makeImagePath(tv.backdrop_path ? tv.backdrop_path : tv.poster_path, "w400")}>
                            <Info variants={infoVar}><h4>{tv.name}</h4></Info>
                        </Box>)}
                    </Row>
                </AnimatePresence>
            </Slider>
        <TvSlider>
            <Section>
                <h3>인기 컨텐츠</h3>
                <div>
                    <button onClick={PrevTvIndex}>&lt;</button>
                    <button onClick={NextTvIndex}>&gt;</button>
                </div>
            </Section>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row variants={rowVar} transition={{type:"tween",duration : 1}} initial="hidden"  custom={back} animate="visible" exit='exit' key={Topindex}>
                    {Topshow?.results.slice(1).slice(offset*Topindex , offset*Topindex + offset).map(tv=> 
                    <Box layoutId={tv.id+""} onClick={ ()=> onBoxClick(tv.id)} variants={boxVar} transition ={{type : 'tween'}} initial="normal" whileHover="hover" key={tv.id} bgPhoto ={makeImagePath(tv.backdrop_path ? tv.backdrop_path : tv.poster_path, "w500")}>
                        <Info variants={infoVar}><h4>{tv.name}</h4></Info>
                    </Box>)}
                </Row>
            </AnimatePresence>
        </TvSlider>
        <AnimatePresence>
                { tvPathMatch ? 
                    (<>
                        <Overlay onClick={onOverlayClick} exit={{opacity : 0}} animate={{opacity : 1}}/>
                        <BigMovie style={{ top : scrollY.get()+100}} layoutId={tvPathMatch.params.id}>
                            {ShowClick && <>
                                <BigCover style={{backgroundImage : `linear-gradient(to top,black,transparent) ,url(${makeImagePath(ShowClick.backdrop_path ? ShowClick.backdrop_path : ShowClick.poster_path,"w500")})`}}/>
                                <BigBox>
                                    <BigTitle>{ShowClick.name}</BigTitle>
                                    <StarAvg>⭐{ShowClick.vote_average}</StarAvg>
                                </BigBox>
                                <Detail></Detail>
                            </>}
                        </BigMovie>
                    </>) : 
                    null}
                </AnimatePresence>                             
        </>
        }</Wrapper>
    )
}

export default Tv