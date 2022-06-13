import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content : space-around;
    align-items : center;
    margin-top : 70px;
`
const Btn = styled.button`
    margin-right : 2rem;
    min-width : 5rem;
    padding : 0.5rem 1rem;
    border : none;
    background : white;
    color : rgb(65,98,168);
    border-radius : 1rem;
    border : 2px solid rgb(65,98,168);
    font-weight : bold;
    cursor : pointer;
`

function Filter() {
    return (
        <Container>
            <Btn>All</Btn>
            <Btn>Comedy</Btn>
            <Btn>Action</Btn>
        </Container>
    )
}

export default Filter