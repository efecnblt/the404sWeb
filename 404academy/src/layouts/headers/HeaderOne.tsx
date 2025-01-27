import NavMenu from "./menu/NavMenu"
import {useState} from "react"
import MobileSidebar from "./menu/MobileSidebar"
import UseSticky from "../../hooks/UseSticky"
import { Link } from "react-router-dom"
import InjectableSvg from "../../hooks/InjectableSvg"
import CustomSelect from "../../ui/CustomSelect"
import TotalWishlist from "../../components/common/TotalWishlist"
import { useAuth } from "../../firebase/AuthContext";
import TotalCart from "../../components/common/TotalCart.tsx";

const HeaderOne = () => {

   const [selectedOption, setSelectedOption] = useState(null);
   const { user, loading} = useAuth();


   const handleSelectChange = (option: any) => {
      setSelectedOption(option);
   };

   const { sticky } = UseSticky();
   const [isActive, setIsActive] = useState<boolean>(false);

   const isAuthor = user?.claims?.some(
       (claim: any) => claim.id === 3 && claim.name === "Author"
   );

   return (
      <>
         <header>
            <div id="header-fixed-height"></div>
            <div id="sticky-header" className={`tg-header__area ${sticky ? "sticky-menu" : ""}`}>
               <div className="container custom-container">
                  <div className="row">
                     <div className="col-12">
                        <div className="tgmenu__wrap">
                           <nav className="tgmenu__nav">
                              <div className="logo">
                                 <Link to="/" style={{textDecoration: "none"}}>
                                    <div
                                        className="text-center"
                                        style={{fontFamily: "'Leckerli One', cursive", fontSize: 24, color: "black"}}
                                    >
                                       404 Academy
                                    </div>
                                 </Link>
                              </div>

                              <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                                 <NavMenu/>
                              </div>
                              <div className="tgmenu__search d-none d-md-block">
                                 <CustomSelect value={selectedOption} onChange={handleSelectChange} />
                              </div>
                              <div className="tgmenu__action">
                                 <ul className="list-wrap">
                                    <li className="mini-cart-icon">
                                       <Link to="/cart" className="cart-count">
                                          <InjectableSvg src="/assets/img/icons/cart.svg" className="injectable"
                                                         alt="img"/>
                                          <TotalCart/>
                                       </Link>
                                    </li>
                                    <li className="wishlist-icon">
                                       <Link to="/wishlist" className="cart-count">
                                          <InjectableSvg src="/assets/img/icons/heart.svg" className="injectable"
                                                         alt="img"/>
                                          <TotalWishlist/>

                                       </Link>
                                    </li>

                                    {loading ? (
                                        // Oturum durumu belirlenene kadar hiçbir şey göstermeyin veya yükleniyor göstergesi
                                        <li className="header-btn login-btn">
                                           {/* İsterseniz bir yükleniyor göstergesi koyabilirsiniz */}
                                           <span>

                                               </span>
                                        </li>
                                    ) : user ? (

                                        <>
                                           {isAuthor && (
                                               <li>

                                                  <Link to={`/instructor-profile/${user.encodedStudentId}`}>

                                                     <img
                                                         src={user.imageUrl}
                                                         alt="Profile"
                                                         style={{
                                                            width: "45px",
                                                            height: "45px",
                                                            borderRadius: "50%",
                                                            marginRight: "8px",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                         }}
                                                     />

                                                  </Link>
                                               </li>
                                           )}
                                           {!isAuthor && (
                                               <li>

                                                  <Link to={`/student-profile/${user.encodedStudentId}`}>

                                                     <img
                                                         src={user.imageUrl}
                                                         alt="Profile"
                                                         style={{
                                                            width: "45px",
                                                            height: "45px",
                                                            borderRadius: "50%",
                                                            marginRight: "8px",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                         }}
                                                     />

                                                  </Link>
                                               </li>
                                           )}

                                        </>


                                    ) : (
                                        <>
                                           <li className="header-btn login-btn">
                                              <Link to="/registration">Sign Up</Link>
                                           </li>
                                           <li className="header-btn login-btn">
                                              <Link to="/login">Log in</Link>
                                           </li>
                                        </>
                                    )}


                                 </ul>
                              </div>
                              <div className="mobile-login-btn">
                                 <Link to="/login"><InjectableSvg src="/assets/img/icons/user.svg" alt=""
                                                                  className="injectable"/></Link>
                              </div>
                              <div onClick={() => setIsActive(true)} className="mobile-nav-toggler"><i
                                  className="tg-flaticon-menu-1"></i></div>
                           </nav>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </header>
         <MobileSidebar isActive={isActive} setIsActive={setIsActive} />
      </>
   )
}

export default HeaderOne
