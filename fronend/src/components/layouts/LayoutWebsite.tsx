import { Outlet } from "react-router-dom"
import { Footer, Header } from ".."
import '@/index.css'

const LayoutWebsite = () => {
  return (
    <div className="container">
          <Header />
          <Outlet />
          <Footer />

    </div>
  )
}

export default LayoutWebsite
