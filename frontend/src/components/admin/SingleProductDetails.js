import React, { Fragment, useEffect } from 'react';
import { Carousel } from 'react-bootstrap'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { getProductDetails, newReview, clearErrors } from '../../actions/productActions'

const SingleProductDetails = ({ match }) => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, product } = useSelector(state => state.productDetails)

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
    }, [dispatch,  error,  match.params.id])


    return (
        <Fragment>
            <MetaData title={'Product Details'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment><br></br>
                    <Link to={`/admin/products`} className="btn btn-info py-1 px-2">
                        <i class="fa fa-arrow-left" aria-hidden="true"> All Product</i>

                    </Link>
                        <h1 className="my-5 text-center" style={{ color: 'green' }}>Product Details</h1>
                            <MetaData title={product.name}/>
                            <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                    <Carousel pause='hover'>
                                        {product.images && product.images.map(image => (
                                            <Carousel.Item key={image.public_id}>
                                                <img className="d-block w-100" src={image.url} alt={product.title} />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>

                                <div className="col-12 col-lg-5 mt-5">
                                <p id="product_seller mb-3"> Name: <strong>{product.name}</strong></p>  <hr />
                                <p id="product_seller mb-3"> Product Id: <strong>{product._id}</strong></p>  <hr />
                                <p id="product_price mb-3"> Price: <strong>${product.price}</strong></p>  <hr />
                                <p id="product_price mb-3"> Category: <strong>{product.category}</strong></p>  
                                <hr />
                                <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'} >{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
                                <hr />

                                <p id="product_price mb-3"> <b>Description</b>: {product.description}</p>  <hr />
                                <div className="rating-outer">
                                    <div className="rating-inner" ></div>
                                    <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                </div>
                                <span id="no_of_reviews">Review</span>
                                <span id="no_of_reviews">({product.numberOfReviews} Reviews)</span>
                                <hr />
                                <p id="product_seller mb-3">Sold by: <strong style={{ color: 'red' }}>{product.seller}</strong></p>
                                </div>
                            </div>

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default SingleProductDetails
