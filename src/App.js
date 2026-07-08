import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Research from './components/Research';
import CaseStudies from './components/CaseStudies';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import NoetherCaseStudy from './pages/NoetherCaseStudy';
import CorroborateCaseStudy from './pages/CorroborateCaseStudy';
import CodeRagCaseStudy from './pages/CodeRagCaseStudy';

const Home = () => (
  <>
    <Header />
    <Hero />
    <Research />
    <CaseStudies />
    <Projects />
    <Skills />
    <Contact />
    <Footer />
  </>
);

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-studies/noether" element={<NoetherCaseStudy />} />
          <Route path="/case-studies/corroborate" element={<CorroborateCaseStudy />} />
          <Route path="/case-studies/code-rag" element={<CodeRagCaseStudy />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
