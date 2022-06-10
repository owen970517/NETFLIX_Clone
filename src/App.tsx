import React from 'react';
import styled from 'styled-components'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';
function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home></Home>}>Home</Route>
        <Route path='/movies/:movieId' element={<Home></Home>}></Route>
        <Route path='/tv' element={<Tv/>}>Tv</Route>
        <Route path='/tv/:tvId' element={<Tv/>}>Tv</Route>
        <Route path='/search/*' element={<Search/>}>Search</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
