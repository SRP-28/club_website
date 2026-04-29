import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackgroundVideo from '../BackgroundVideo';
import Sponsors from '../Sponsors';

const PageLayout = () => {
  return (
    <>
      <BackgroundVideo />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Sponsors />
      <Footer />
    </>
  );
};

export default PageLayout;
