const Footer = () => {
  return (
    <div>
              <footer>
        <div className="company">
          <p className="title-footer">Funiro.</p>
          <p>400 University Drive Suite 200 Coral <br /> Gables,<br />
            FL 33134 USA</p>
        </div>
        <div className="links">
          <p style={{ color: '#9F9F9F' }}>Links</p>
          <p>Home</p>
          <p>Shop</p>
          <p>About</p>
          <p>Contact</p>
        </div>
        <div className="help">
          <p style={{ color: '#9F9F9F' }}>Help</p>
          <p>Payment Options</p>
          <p>Returns</p>
          <p>Privacy Policies</p>
        </div>
        <div className="newletter">
          <p style={{ color: '#9F9F9F' }}>Newsletter</p>
          <input type="text" placeholder="Enter Your Email Address" />
          <button>SUBSCRIBE</button>
        </div>
      </footer>
      <div className="copyright" >
        <hr style={{ color: '#D9D9D9', marginTop: '50px' }} />
        <p style={{ marginTop: '30px', marginBottom: '50px' }}>2023 furino. All rights reverved</p>
      </div>
    </div>
  )
}

export default Footer