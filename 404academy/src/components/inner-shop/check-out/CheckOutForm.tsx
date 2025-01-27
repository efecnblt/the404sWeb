
interface FormData {
   firstName: string;
   lastName: string;
   companyName: string;
   countryName: string;
   streetAddress: string;
   streetAddressTwo: string;
   townName: string;
   districtName: string;
   zipCode: string;
   phone: string;
   email: string;
   note: string;
}

interface Errors {
   [key: string]: string;
}

interface CheckOutFormProps {
   formData: FormData;
   errors: Errors;
   handleChange: (
       e: React.ChangeEvent<
           HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
       >
   ) => void;
   isAuthFieldsDisabled?: boolean;
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({
                                                      formData,
                                                      errors,
                                                      handleChange,
                                                      isAuthFieldsDisabled = false,
                                                   }) =>{

   return (
       <div className="col-lg-7">
          <form onSubmit={(e) => e.preventDefault()} className="customer__form-wrap">
             <span className="title">Billing Details</span>

             {/* First name - Last name */}
             <div className="row">
                <div className="col-md-6">
                   <div className="form-grp">
                      <label htmlFor="first-name">First name *</label>
                      <input
                          type="text"
                          id="first-name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? "error" : ""}
                          readOnly={isAuthFieldsDisabled}
                          style={
                             isAuthFieldsDisabled
                                 ? { backgroundColor: "#e2e2e2", cursor: "not-allowed" }
                                 : {}
                          }
                      />
                      {errors.firstName && <small>{errors.firstName}</small>}
                   </div>
                </div>

                <div className="col-md-6">
                   <div className="form-grp">
                      <label htmlFor="last-name">Last name *</label>
                      <input
                          type="text"
                          id="last-name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? "error" : ""}
                          readOnly={isAuthFieldsDisabled}
                          style={
                             isAuthFieldsDisabled
                                 ? { backgroundColor: "#e2e2e2", cursor: "not-allowed" }
                                 : {}
                          }
                      />
                      {errors.lastName && <small>{errors.lastName}</small>}
                   </div>
                </div>
             </div>

             {/* Company name */}
             <div className="form-grp">
                <label htmlFor="company-name">Company name (optional)</label>
                <input
                    type="text"
                    id="company-name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                />
             </div>

             {/* Country */}
             <div className="form-grp select-grp">
                <label htmlFor="country-name">Country / Region *</label>
                <select
                    id="country-name"
                    name="countryName"
                    value={formData.countryName}
                    onChange={handleChange}
                    className={`country-name ${errors.countryName ? "error" : ""}`}
                >
                   <option value="">-- Select your country --</option>
                   <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                   <option value="United States (US)">United States (US)</option>
                   <option value="Turkey">Turkey</option>
                   <option value="Saudi Arabia">Saudi Arabia</option>
                   <option value="Portugal">Portugal</option>
                </select>
                {errors.countryName && <small>{errors.countryName}</small>}
             </div>

             {/* Street address */}
             <div className="form-grp">
                <label htmlFor="street-address">Street address *</label>
                <input
                    type="text"
                    id="street-address"
                    name="streetAddress"
                    placeholder="House number and street name"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={errors.streetAddress ? "error" : ""}
                />
                {errors.streetAddress && <small>{errors.streetAddress}</small>}
             </div>

             <div className="form-grp">
                <input
                    type="text"
                    id="street-address-two"
                    name="streetAddressTwo"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={formData.streetAddressTwo}
                    onChange={handleChange}
                />
             </div>

             {/* Town/City */}
             <div className="form-grp">
                <label htmlFor="town-name">Town / City *</label>
                <input
                    type="text"
                    id="town-name"
                    name="townName"
                    value={formData.townName}
                    onChange={handleChange}
                    className={errors.townName ? "error" : ""}
                />
                {errors.townName && <small>{errors.townName}</small>}
             </div>

             {/* District */}
             <div className="form-grp select-grp">
                <label htmlFor="district-name">District *</label>
                <select
                    id="district-name"
                    name="districtName"
                    value={formData.districtName}
                    onChange={handleChange}
                    className={`district-name ${errors.districtName ? "error" : ""}`}
                >
                   <option value="">-- Select your district --</option>
                   <option value="Alabama">Alabama</option>
                   <option value="Alaska">Alaska</option>
                   <option value="Arizona">Arizona</option>
                   <option value="California">California</option>
                   <option value="New York">New York</option>
                </select>
                {errors.districtName && <small>{errors.districtName}</small>}
             </div>

             {/* ZIP Code */}
             <div className="form-grp">
                <label htmlFor="zip-code">ZIP Code *</label>
                <input
                    type="text"
                    id="zip-code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={errors.zipCode ? "error" : ""}
                />
                {errors.zipCode && <small>{errors.zipCode}</small>}
             </div>

             {/* Phone - Email */}
             <div className="row">
                <div className="col-md-6">
                   <div className="form-grp">
                      <label htmlFor="phone">Phone *</label>
                      <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={errors.phone ? "error" : ""}

                      />
                      {errors.phone && <small>{errors.phone}</small>}
                   </div>
                </div>
                <div className="col-md-6">
                   <div className="form-grp">
                      <label htmlFor="email">Email address *</label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "error" : ""}
                          readOnly={isAuthFieldsDisabled}
                          style={
                             isAuthFieldsDisabled
                                 ? { backgroundColor: "#e2e2e2", cursor: "not-allowed" }
                                 : {}
                          }
                      />
                      {errors.email && <small>{errors.email}</small>}
                   </div>
                </div>
             </div>

             {/* Additional Information */}
             <span className="title title-two">Additional Information</span>
             <div className="form-grp">
                <label htmlFor="note">Order notes (optional)</label>
                <textarea
                    id="note"
                    name="note"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    value={formData.note}
                    onChange={handleChange}
                ></textarea>
             </div>
          </form>
       </div>
   );
};

export default CheckOutForm;
