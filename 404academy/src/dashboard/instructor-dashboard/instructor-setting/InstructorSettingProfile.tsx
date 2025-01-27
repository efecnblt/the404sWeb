"use client";
import { Link } from "react-router-dom";
import { useAuth } from "../../../firebase/AuthContext.tsx";
import { useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const InstructorSettingProfile = ({ style }: any) => {
   const { user } = useAuth();
   const [image_url, setProfileImage] = useState(user?.imageUrl || "");

   // Fotoğraf değişikliğini işleme fonksiyonu
   const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user?.id) return;

      try {
         // Firebase Storage'a dosyayı yükle
         const storage = getStorage();
         const storageRef = ref(storage, `profilePhotos/${user.id}/${file.name}`);

         await uploadBytes(storageRef, file);

         // Yüklenen dosyanın URL'sini al
         const downloadURL = await getDownloadURL(storageRef);

         // Yeni fotoğraf URL'siyle backend API'ye profil güncelleme isteği gönder
         const updateResponse = await axios.put("http://165.232.76.61:5001/api/Users/updateprofile", {
            userId: user.id,
            username: user.username,
            firstName: user.name,
            lastName: user.surname,
            biography: user.bio,
            imageUrl: downloadURL,
         });

         if (updateResponse.status === 200) {
            setProfileImage(downloadURL);
            alert("Profile photo updated successfully!");
         }
      } catch (error) {
         console.error("Error updating profile photo:", error);
         alert("Failed to update profile photo.");
      }
   };

   // Form submit işlemi
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const updatedData = {
         userId: user.id,
         username: (e.target as any).username.value,
         firstName: (e.target as any).firstname.value,
         lastName: (e.target as any).lastname.value,
         biography: (e.target as any).bio.value,
         imageUrl: image_url,
      };

      try {
         const response = await axios.put("http://165.232.76.61:5001/api/Users/updateprofile", updatedData);
         if (response.status === 200) {
            alert("Profile updated successfully!");
         }
      } catch (error) {
         console.error("Error updating profile information:", error);
         alert("Failed to update profile information.");
      }
   };

   return (
       <>
          {style ? (
              <div
                  className="instructor__cover-bg"
                  style={{ backgroundImage: `url(/assets/img/bg/features_bg.jpg)` }}
              >
                 <div className="instructor__cover-info">
                    <div className="instructor__cover-info-left">
                       <div className="thumb">
                          <img src={image_url || user?.imageUrl} alt="Profile" />
                          <input
                              type="file"
                              id="profilePhoto"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={handlePhotoChange}
                          />
                       </div>
                       <button
                           title="Upload Photo"
                           onClick={() => document.getElementById("profilePhoto")?.click()}
                       >
                          <i className="fas fa-camera"></i>
                       </button>
                    </div>
                    <div className="instructor__cover-info-right">
                       <Link to="#" className="btn btn-two arrow-btn">
                          Edit Cover Photo
                       </Link>
                    </div>
                 </div>
              </div>
          ) : (
              <div
                  className="instructor__cover-bg"
                  style={{ backgroundImage: `url(/assets/img/bg/features_bg.jpg)` }}
              >
                 <div className="instructor__cover-info">
                    <div className="instructor__cover-info-left">
                       <div className="thumb">
                          <img src={image_url || user?.imageUrl} alt="Profile" />
                          <input
                              type="file"
                              id="profilePhoto"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={handlePhotoChange}
                          />
                       </div>
                       <button
                           title="Upload Photo"
                           onClick={() => document.getElementById("profilePhoto")?.click()}
                       >
                          <i className="fas fa-camera"></i>
                       </button>
                    </div>
                    <div className="instructor__cover-info-right">
                       <Link to="#" className="btn btn-two arrow-btn">
                          Edit Cover Photo
                       </Link>
                    </div>
                 </div>
              </div>
          )}

          <div className="instructor__profile-form-wrap">
             <form onSubmit={handleSubmit} className="instructor__profile-form">
                <div className="row">
                   <div className="col-md-6">
                      <div className="form-grp">
                         <label htmlFor="firstname">First Name</label>
                         <input id="firstname" type="text" defaultValue={user?.name} />
                      </div>
                   </div>
                   <div className="col-md-6">
                      <div className="form-grp">
                         <label htmlFor="lastname">Last Name</label>
                         <input id="lastname" type="text" defaultValue={user?.surname} />
                      </div>
                   </div>
                   <div className="col-md-6">
                      <div className="form-grp">
                         <label htmlFor="username">User Name</label>
                         <input id="username" type="text" defaultValue={user?.username} />
                      </div>
                   </div>
                </div>
                <div className="form-grp">
                   <label htmlFor="bio">Bio</label>
                   <textarea id="bio" defaultValue={user?.bio} />
                </div>
                <div className="submit-btn mt-25">
                   <button type="submit" className="btn">
                      Update Info
                   </button>
                </div>
             </form>
          </div>
       </>
   );
};

export default InstructorSettingProfile;
