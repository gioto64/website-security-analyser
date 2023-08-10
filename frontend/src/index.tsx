import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import LoginPage from './components/loggedout/LoginPage';
import RegisterPage from './components/loggedout/RegisterPage';
import BasePage from './components/BasePage';
import Search from './components/loggedin/Search';
import Url from './components/loggedin/Url';
import File from './components/loggedin/File';
import Profile from './components/loggedin/Profile';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<BasePage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="files" element={<File />} />
        <Route path="urls" element={<Url />} />
        <Route path="search" element={<Search />} />
        <Route path ="/profile" element={<Profile />} />
      </Route>
    </>

  )
);

root.render(
  <RouterProvider router={router}/>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
