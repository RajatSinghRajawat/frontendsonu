import Header from "./components/header"
import Footer from "./components/footer"
import BackToTop from "./components/back-to-top"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <BackToTop />
      <Footer />
    </>
  )
}
