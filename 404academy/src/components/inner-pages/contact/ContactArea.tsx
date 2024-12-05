import ContactForm from "../../../forms/ContactForm"
import InjectableSvg from "../../../hooks/InjectableSvg"

const ContactArea = () => {
   return (
       <section className="contact-area section-py-120">
          <div className="container">
             <div className="row">
                <div className="col-lg-4">
                   <div className="contact-info-wrap">
                      <ul className="list-wrap">
                         <li>
                            <div className="icon">
                               <InjectableSvg src="assets/img/icons/map.svg" alt="img" className="injectable"/>
                            </div>
                            <div className="content">
                               <h4 className="title">Address</h4>
                               <p>Cumhuriyet, 2254. Sk. No:2, 41400<br/> Gebze/Kocaeli </p>
                            </div>
                         </li>
                         <li>
                            <div className="icon">
                               <InjectableSvg src="assets/img/icons/contact_phone.svg" alt="img"
                                              className="injectable"/>
                            </div>
                            <div className="content">
                               <h4 className="title">Phone</h4>
                               <a href="tel:0123456789">+90 535 384 8191</a>
                               <a href="tel:0123456789">+90 (0262) 605 10 00</a>
                            </div>
                         </li>
                         <li>
                            <div className="icon">
                               <InjectableSvg src="assets/img/icons/emial.svg" alt="img" className="injectable"/>
                            </div>
                            <div className="content">
                               <h4 className="title">E-mail Address</h4>
                               <a href="efecanbolat34@gmail.com">efecanbolat34@gmail.com</a>
                               <a href="efecanbolat34@gmail.com">efecanbolat38@gmail.com</a>
                            </div>
                         </li>
                      </ul>
                   </div>
                </div>

                <div className="col-lg-8">
                   <div className="contact-form-wrap">
                      <h4 className="title">Send Us Message</h4>
                      <p>Your email address will not be published. Required fields are marked *</p>
                      <ContactForm/>
                      <p className="ajax-response mb-0"></p>
                   </div>
                </div>
             </div>
             <div className="contact-map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.8945897579147!2d29.359128999999996!3d40.80831010000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cade56af489127%3A0x28e488940d24037f!2sGebze%20Teknik%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1732747580072!5m2!1str!2str" style={{border: '0'}} loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
             </div>
          </div>
       </section>
   )
}

export default ContactArea