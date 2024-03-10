import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import Signin from "./routes/Signin";
import Home from './routes/Home';
import Signup from './routes/Signup'
import User from './routes/User';

const App = () => {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/user/:userName" element={<User/>}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
