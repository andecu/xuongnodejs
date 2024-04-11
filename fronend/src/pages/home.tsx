import { Banner, Blog, ProductList, Services, Shop } from '@/components'

const HomePage = () => {
  return (
    <>
         <div className="container">

      <Banner />
      <main>
       <ProductList featured={true}/>
       <Shop />
       <Blog />
      </main>
        <Services />
    </div>
    </>
  )
}

export default HomePage