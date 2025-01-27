import CheckOutForm from "./CheckOutForm"
import {useDispatch, useSelector} from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../../redux/store";
import UseCartInfo from "../../../hooks/UseCartInfo";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../firebase/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import {remove_cart_product} from "../../../redux/features/cartSlice.ts";
import {removeFavorite} from "../../../redux/features/wishlistSlice.ts";

const CheckOutArea = () => {

  const navigate = useNavigate();
  const productItem = useSelector((state: RootState) => state.cart.cart);
  const { total } = UseCartInfo();

// Form verilerini tutacak local state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    countryName: "",
    streetAddress: "",
    streetAddressTwo: "",
    townName: "",
    districtName: "",
    zipCode: "",
    phone: "",
    email: "",
    note: "",
  });

  // Hataları tutacak state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Değer değiştiğinde çalışacak fonksiyon
  const handleChange = (
      e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Alan değişince hatayı sıfırlayabiliriz (isterseniz)
    setErrors({ ...errors, [name]: "" });
  };

  // Validasyon fonksiyonu
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.countryName) {
      newErrors.countryName = "Country is required";
    }
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }
    if (!formData.townName.trim()) {
      newErrors.townName = "Town/City is required";
    }
    if (!formData.districtName) {
      newErrors.districtName = "District is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP Code is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    return newErrors;
  };

  const { user } = useAuth();
  const dispatch = useDispatch(); // dispatch tanımlandı
  // "Place order" butonu tıklanınca
  const handlePlaceOrder = async () => {
    const foundErrors = validateForm();




    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      toast.error("Please fill in the required fields!", { position: "top-center" });
      return;
    }

    try {
      const studentId = user?.studentId; // Kullanıcının Auth'dan alınan studentId'si
      const registrations = productItem.map((item: any) => ({
        courseId: item.id, // Her ürünün kurs ID'si
        authorId: item.authorId, // authorId bilgisini de dahil ediyoruz
      }));

      // Her kurs için API'ye kayıt isteği gönder
      await Promise.all(
          registrations.map(async (registration) => {
            const response = await fetch(
                `http://165.232.76.61:5001/api/Courses/enroll?studentId=${studentId}&courseId=${registration.courseId}`,
                {
                  method: "POST",
                }
            );

            if (!response.ok) {
              throw new Error(`Failed to enroll in course ID: ${registration.courseId}`);
            }

            await fetch(
                `http://165.232.76.61:5001/api/FavoriteCourses/removeFromFavorites?studentId=${studentId}&courseId=${registration.courseId}`,
                {
                  method: "DELETE",
                }
            );

            dispatch(remove_cart_product({ id: registration.courseId }));
            dispatch(removeFavorite(studentId, registration.courseId));

          })
      );
      toast.success("Enrollment successful!", { position: "top-center" });

      setTimeout(() => {
        const firstCourse = registrations[0]; // İlk kursa yönlendirme
        navigate(`/course-details/${firstCourse.authorId}/${firstCourse.courseId}`);
      }, 3000); // 3 saniye (3000 milisaniye)

    } catch (error: any) {
      console.error("Error during order processing:", error);
      toast.error("Failed to complete the order!", { position: "top-center" });
    }
  };




  useEffect(() => {
    if (user) {

      setFormData((prev) => ({
        ...prev,
        firstName: user.name || "",
        lastName: user.surname || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  return (
    <div className="checkout__area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="coupon__code-wrap">
              <form onSubmit={(e) => e.preventDefault()} className="coupon__code-form">
                <p>If you have a coupon code, please apply it below.</p>
                <input type="text" placeholder="Coupon code" />
                <button type="submit" className="btn">Apply coupon</button>
              </form>
            </div>
          </div>

          <CheckOutForm  formData={formData}
                         errors={errors}
                         handleChange={handleChange}/>

          <div className="col-lg-5">
            <div className="order__info-wrap">
              <h2 className="title">YOUR ORDER</h2>
              <ul className="list-wrap">
                <li className="title">Product <span>Subtotal</span></li>
                {/* <!-- item list --> */}
                {productItem.map((add_item: any, add_index: any) =>
                  <li key={add_index}>
                    {add_item.title} <strong>{add_item.price.toFixed(2)} x {add_item.quantity}</strong>
                    <span>${add_item.quantity * add_item.price}</span>
                  </li>
                )}
                <li>Subtotal <span>${total.toFixed(2)}</span></li>
                <li>Total <span>${total.toFixed(2)}</span></li>
              </ul>
             <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link to="#">privacy policy.</Link></p>
              <button onClick={handlePlaceOrder} className="btn">Place order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOutArea
