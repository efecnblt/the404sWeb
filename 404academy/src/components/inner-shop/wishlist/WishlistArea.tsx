import { useDispatch } from "react-redux";
import UseWishlistInfo from "../../../hooks/UseWishlistInfo";
import { Link } from "react-router-dom";
import { addToCart } from "../../../redux/features/cartSlice";
import {useAuth} from "../../../firebase/AuthContext.tsx";
import {removeFavorite} from "../../../redux/features/wishlistSlice.ts";

const WishlistArea = () => {

   const { wishlistItems } = UseWishlistInfo();
   const dispatch = useDispatch();

    const { user } = useAuth();
    const studentId = user?.studentId;

   return (
      <div className="cart__area section-py-120">
         <div className="container">
            {wishlistItems.length === 0 ? (
               <div className="mb-30">
                  <div className="empty_bag text-center">
                     <p className="py-3">Your Wishlist is Empty</p>
                     <Link to={"/courses"}>
                        <button className="btn">Go To All Courses</button>
                     </Link>
                  </div>
               </div>
            ) : (
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <table className="table cart__table">
                        <thead>
                           <tr>
                              <th className="product__thumb">Images</th>
                              <th className="product__name">Product</th>
                              <th className="product__price">Price</th>
                              <th className="product__quantity">Add To Cart</th>
                              <th className="product__remove">Remove</th>
                           </tr>
                        </thead>
                        <tbody>

                           {wishlistItems.map((item: any) => (
                               console.log(item),
                              <tr key={item.id}>
                                 <td className="product__thumb">
                                    <Link to={`/course-details/${item.authorId}/${item.id}`}><img src={item.thumb} alt="cart" /></Link>
                                 </td>
                                 <td className="product__name">
                                    <Link to={`/course-details/${item.authorId}/${item.id}`}>{item.title}</Link>
                                 </td>
                                 <td className="product__price">${item.price}</td>
                                 <td className="product__cart-btn">
                                    <button onClick={() => dispatch(addToCart({
                                        id: item.id,
                                        title: item.title,
                                        authorId: item.authorId,
                                        quantity: 1,
                                        price: item.price,
                                        thumb: item.thumb
                                        }

                                    ))} className="btn">Add To Cart</button>
                                 </td>
                                 <td className="product__remove">
                                    <a onClick={() =>  dispatch(removeFavorite(studentId, item.id)) } style={{ cursor: "pointer" }}>×</a>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default WishlistArea;
