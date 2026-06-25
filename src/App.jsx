import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar          from './components/ui/Navbar'
import Footer          from './components/ui/Footer'
import PageTransition  from './components/ui/PageTransition'
import ScrollToTop     from './components/ScrollToTop'
import Home            from './pages/Home'
import SearchResults   from './pages/SearchResults'
import MovieDetails    from './pages/MovieDetails'

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <p className="font-display text-8xl text-cinema-gold">404</p>
      <p className="text-cinema-muted text-lg">This scene was cut from the film.</p>
      <a href="/" className="btn-primary mt-2">Back to Home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/*
        ScrollToTop lives inside BrowserRouter so it has access
        to useLocation(). It handles both:
          - auto-scroll to top on route change
          - the floating "back to top" button
      */}
      <ScrollToTop />
      <Navbar />

      <main className="min-h-screen">
        {/*
          PageTransition uses the pathname as its key —
          React remounts it on every navigation,
          triggering the fade-in animation fresh.
        */}
        <PageTransition>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/search"    element={<SearchResults />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      <Footer />
    </BrowserRouter>
  )
}
