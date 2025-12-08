import Layout from "./Layout.jsx";

import Home from "./Home";

import Listings from "./Listings";

import ListingDetail from "./ListingDetail";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import Contact from "./Contact";

import About from "./About";

import SocialMedia from "./SocialMedia";

import AdminDashboard from "./AdminDashboard";

import Neighborhood from "./Neighborhood";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Listings: Listings,
    
    ListingDetail: ListingDetail,
    
    Blog: Blog,
    
    BlogPost: BlogPost,
    
    Contact: Contact,
    
    About: About,
    
    SocialMedia: SocialMedia,
    
    AdminDashboard: AdminDashboard,
    
    Neighborhood: Neighborhood,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Listings" element={<Listings />} />
                
                <Route path="/ListingDetail" element={<ListingDetail />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/SocialMedia" element={<SocialMedia />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/Neighborhood" element={<Neighborhood />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}