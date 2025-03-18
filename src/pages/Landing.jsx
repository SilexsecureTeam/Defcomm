import Nav from "../components/landing/Header/Nav.jsx"
import Home from "../components/landing/Content/Home.jsx"
import CoreValue from "../components/landing/Content/CoreValue.jsx"
import ResultsVideo from "../components/landing/Content/ResultsVideo.jsx"
import OurProduct from "../components/landing/Content/OurProduct.jsx"
import Footer from "../components/landing/Footer/Footer.jsx"
import BackToTopButton from "../components/BackToTopButton.jsx"

function Landing() {
    return (
        <div className="w-full mx-auto">
            <Nav />
            <Home />
            <CoreValue />
            <ResultsVideo />
            <OurProduct />
            <Footer />
            <BackToTopButton />
        </div>
    )
}

export default Landing
