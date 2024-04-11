import { Link, NavLink } from "react-router-dom"

const Header = () => {
  return (
    <header>
    <div className="menuBar">
      <div className="logoHeader">
        <Link to="/">
          <img src="/images/Meubel House_Logos-05.png" alt="" />
        </Link>
        <p className="logo-text">Furniro</p>
      </div>
    </div>
    <div className="menu">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
          </li>
        <li>
          <NavLink to="/shop">Shop</NavLink>
          </li>
        <li>
          <NavLink to="/about">About</NavLink>
          </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
          </li>
      </ul>
    </div>
    <div className="iconNavigate">
      <i className="fa-regular fa-user"></i>
      <i className="fas fa-search"></i>
      <i className="fa-regular fa-heart"></i>
      <i className="fas fa-shopping-cart"></i>
    </div>
  </header>
  )
}

export default Header