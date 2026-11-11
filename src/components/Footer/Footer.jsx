"use client";
import { useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaRegClock } from "react-icons/fa";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaCcApplePay } from "react-icons/fa";
import { isValidEmail, subscribeNewsletter } from "../../lib/newsletter";
const logo = "/assets/images/noorix_logo.jpg";
import "./Footer.css";

const NoorrixFooter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (status === "loading") return;

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const successMessage = await subscribeNewsletter(email);
      setStatus("success");
      setMessage(successMessage);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <footer className="footer-root">
      {/* 3-column main section */}
      <div className="footer-main">

        {/* Column 1 — Brand / contact */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Noorrix Motors" />
          </div>
          <p className="footer-description">
            Noorrix Motors Ltd is a trusted UK used car dealership offering quality vehicles, transparent pricing, expert sourcing, warranty, delivery, and professional automotive repair services with exceptional customer care.
          </p>
          <div className="footer-social">
            <a href="https://www.facebook.com/noorrixmotors/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
        {/* Center group — Company + Services + Contact + Newsletter */}
        <div className="footer-center-group">
          <div className="footer-center-cols">

            {/* Company */}
            <div className="footer-col-links">
              <h4 className="footer-col-title">Company</h4>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><a href="/#faqs">FAQs</a></li>
                <li><Link href="/blogs">Blogs</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-col-links">
              <h4 className="footer-col-title">Services</h4>
              <ul>
                <li><Link href="/stock">Used Cars</Link></li>
                <li><Link href="/stock">Our Stock</Link></li>
                <li><Link href="/warranty">warrenty</Link></li>
                <li><Link href="/dents-paints">Dents & paints</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-col-links">
              <h4 className="footer-col-title">Contact Info</h4>
              <div className="footer-contact-info">
                <a href="https://maps.google.com/?q=16+Eastside+Cauldwell+Walk+Bedford+MK42+9DT" target="_blank" rel="noopener noreferrer">
                  <p><FaMapMarkerAlt className="footer-icon" /> 16 Eastside, Cauldwell Walk, Bedford MK42 9DT</p>
                </a>
                <p><FaEnvelope className="footer-icon" /> <a href="mailto:info@noorrixmotors.co.uk">info@noorrixmotors.co.uk</a></p>
                <p><FaPhone className="footer-icon" /> <a href="tel:07300503113">07300 503113</a></p>
              </div>
            </div>

          </div>

          {/* Newsletter fills the bottom space */}
          <div className="footer-newsletter-inline">
            <span className="footer-email-label">Newsletter</span>
            <div className="footer-subscribe-col">
              <div className="footer-subscribe-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="footer-subscribe-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={status === "loading"}
                />
                <button
                  type="button"
                  className="footer-subscribe-btn"
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>
              {message && (
                <p className={`footer-subscribe-message ${status === "success" ? "footer-subscribe-message--success" : "footer-subscribe-message--error"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="footer-col-links">
          <h4 className="footer-col-title">Opening Hours</h4>
          <ul className="footer-hours-list">
            <li><span className="footer-hours-day">Mon</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
            <li><span className="footer-hours-day">Tue</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
            <li><span className="footer-hours-day">Wed</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
            <li><span className="footer-hours-day">Thu</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
            <li><span className="footer-hours-day">Fri</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
            <li><span className="footer-hours-day">Sat</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
            <li><span className="footer-hours-day">Sun</span><span className="footer-hours-time">9:00 AM – 6:00 PM</span><FaRegClock className="footer-hours-icon" /></li>
          </ul>
          <p className="footer-hours-note">After Hours Viewing Available On Request</p>
          <div className="footer-payment-inline">
            <span className="footer-payment-label">We Accept</span>
            <div className="footer-payment-icons">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcAmex />
              <FaCcPaypal />
              <FaCcApplePay />
            </div>
          </div>
        </div>


      </div>

      {/* Legal bottom */}
      <div className="footer-legal-bottom">
        <nav className="footer-legal-links">
          <Link href="/privacy-policy">Privacy</Link>
          <span className="footer-legal-sep">|</span>
          <Link href="/cookie-policy">Cookies</Link>
          <span className="footer-legal-sep">|</span>
          <Link href="/terms-of-use">Terms of Use</Link>
          <span className="footer-legal-sep">|</span>
          <Link href="/sitemap">Sitemap</Link>
        </nav>
        <p className="footer-registration">
          Noorrix Motors Ltd is registered in England and Wales. Company No: 17150029
        </p>
        <p className="footer-copyright">
          2026 &copy; Noorrix Motors Ltd. All Rights Reserved{" "}
          <span className="footer-sep-dot">&#9679;</span>{" "}Designed by{" "}
          <a href="https://twocoreglobal.com" target="_blank" rel="noopener noreferrer">
            twocoreglobal.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default NoorrixFooter;
