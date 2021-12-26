import React, { Fragment, useEffect, useState } from "react";
import { useAlert } from 'react-alert';
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import Loader from './layout/Loader';
import MetaData from "./layout/MetaData";
import Product from './product/Product';


const Home = ({ match }) => {

  const [currentPage, setCurrentPage] = useState(1);

  const alert = useAlert();
  const dispatch = useDispatch();


  const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)

  

  const keyword = match.params.keyword;

  useEffect(() => {
      if (error) {
        return alert.error(error)
      }


      dispatch(getProducts(currentPage));

      
  }, [dispatch, alert, keyword,  currentPage, error])



  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }



  let count = productsCount;
    if (keyword) {
        count = filteredProductsCount
    }


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>

          {/* Pagenation Code */}
          {resPerPage <= productsCount && (
            <div className="d-flex justify-content-center mt-5">
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText={'Next'}
                    prevPageText={'Prev'}
                    firstPageText={'First'}
                    lastPageText={'Last'}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            </div>
        )} 

        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
