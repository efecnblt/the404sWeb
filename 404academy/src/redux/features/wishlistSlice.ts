import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
import { AppDispatch } from "../store";

export interface Product {
   id: number;
   title: string;
   thumb: string;
   price: number;
   authorId?: number; // <-- yeni eklenen alan
}

interface WishlistState {
   wishlist: Product[];
}

const initialState: WishlistState = {
   wishlist: [], // LocalStorage yerine doğrudan boş başlatıyoruz
};

const wishlistSlice = createSlice({
   name: "wishlist",
   initialState,
   reducers: {
      setWishlist: (state, { payload }: PayloadAction<Product[]>) => {
         state.wishlist = payload;
      },
      addToWishlist: (state, { payload }: PayloadAction<Product>) => {
         state.wishlist.push(payload);
         toast.success(`${payload.title} added to wishlist`);
      },
      removeFromWishlist: (state, { payload }: PayloadAction<number>) => {
         state.wishlist = state.wishlist.filter((item) => item.id !== payload);
         toast.error(`Removed from your wishlist`);
      },
      clearWishlist: (state) => {
         state.wishlist = [];
      },
   },
});

export const {
   setWishlist,
   addToWishlist,
   removeFromWishlist,
   clearWishlist,
} = wishlistSlice.actions;

// API ile favori listeleme
export const fetchWishlist = (studentId: number) => async (dispatch: AppDispatch) => {
   try {
      const response = await axios.get(
          `http://165.232.76.61:5001/api/FavoriteCourses/getbystudentid?studentId=${studentId}`
      );
      // Favorileri eşleştirirken her bir kursun detaylarını almak için promises kullanılıyor
      const favoritePromises = response.data.map(async (fav: any) => {
         // Kurs detaylarını al
         const courseResponse = await axios.get(
             `http://165.232.76.61:5001/api/Courses/getbyid?id=${fav.courseID}`
         );

         const courseData = courseResponse.data?.data;

         return {
            id: fav.courseID,
            title: fav.courseName,
            thumb: fav.imageURL,
            price: fav.price,
            authorId: courseData?.authorId || null, // Author ID bilgisi ekleniyor
         };
      });

      // Tüm favori kursların verilerini bekle
      const favorites = await Promise.all(favoritePromises);

      dispatch(setWishlist(favorites));
   } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist.");
   }
};

// API ile favori ekleme
export const addFavorite =
    (studentId: number, product: Product) => async (dispatch: AppDispatch) => {
       try {
          const requestBody = {
             favoriteID: 0, // Yeni favori için 0 gönderiyoruz
             studentID: studentId, // Öğrenci ID'si
             courseID: product.id, // Ürün (Kurs) ID'si
          };

          await axios.post("http://165.232.76.61:5001/api/FavoriteCourses/add", requestBody, {
             headers: {
                "Content-Type": "application/json", // JSON formatında veri gönderiliyor
                Accept: "*/*", // Tüm formatları kabul ediyoruz
             },
          });
          dispatch(addToWishlist(product));
       } catch (error) {
          console.error("Error adding favorite:", error);
          toast.error("Failed to add to wishlist.");
       }
    };

// API ile favori çıkarma
export const removeFavorite =
    (studentId: number, courseId: number) => async (dispatch: AppDispatch) => {
       try {
          await axios.delete(
              `http://165.232.76.61:5001/api/FavoriteCourses/delete?studentId=${studentId}&courseId=${courseId}`
          );
          dispatch(removeFromWishlist(courseId));
       } catch (error) {
          console.error("Error removing favorite:", error);toast.error("Failed to remove from wishlist.");
       }
    };


export default wishlistSlice.reducer;
