"use client";
import React from "react";
import Link from "next/link";
import {
  FaSitemap,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaCar,
  FaTools,
  FaExchangeAlt,
  FaSearch,
  FaTruck,
  FaWrench,
  FaShieldAlt,
  FaShieldAlt as FaVan,
  FaLock,
  FaCookieBite,
  FaFileAlt,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import Navbar from "../components/Navbar/Navbar";
import NoorrixFooter from "../components/Footer/Footer";
import "./Sitemap.css";

const sitemapCategories = [
  {
    tag: "Navigation",
    title: "Main Pages",
    icon: <FaHome />,
    links: [
      { label: "Home", path: "/", icon: <FaHome /> },
      { label: "About Us", path: "/about", icon: <FaInfoCircle /> },
      { label: "Contact Us", path: "/contact", icon: <FaEnvelope /> },
    ],
  },
  {
    tag: "Vehicles & Services",
    title: "Our Services",
    icon: <FaCar />,
    links: [
      { label: "Used Cars", path: "/cars", icon: <FaCar /> },
      { label: "Our Stock", path: "/stock", icon: <MdDirectionsCar /> },
      { label: "Dents & Paints", path: "/dents-paints", icon: <FaTools /> },
      { label: "Part Exchange", path: "/part-exchange", icon: <FaExchangeAlt /> },
      { label: "Sell My Car", path: "/sell-my-car", icon: <FaExchangeAlt /> },
      { label: "Vehicle Sourcing", path: "/vehicle-sourcing", icon: <FaSearch /> },
      { label: "Delivery", path: "/delivery", icon: <FaTruck /> },
{ label: "Servicing", path: "/servicing", icon: <FaWrench /> },
      { label: "Used Vans", path: "/vans", icon: <FaTruck /> },
      { label: "Warranty", path: "/warranty", icon: <FaShieldAlt /> },
    ],
  },
  {
    tag: "Legal",
    title: "Legal & Info",
    icon: <FaLock />,
    links: [
      { label: "Privacy Policy", path: "/privacy-policy", icon: <FaLock /> },
      { label: "Cookie Policy", path: "/cookie-policy", icon: <FaCookieBite /> },
      { label: "Terms of Use", path: "/terms-of-use", icon: <FaFileAlt /> },
      { label: "Sitemap", path: "/sitemap", icon: <FaSitemap /> },
    ],
  },
];

const lastUpdated = "25 May 2026";

function Sitemap() {
  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="sm-breadcrumb-wrapper">
        <div className="sm-breadcrumb-container">
          <Link href="/" className="sm-breadcrumb-link">Home</Link>
          <span className="sm-breadcrumb-sep">&rsaquo;</span>
          <span className="sm-breadcrumb-current">Sitemap</span>
        </div>
      </div>

      {/* Hero */}
      <section className="sm-hero">
        <div className="sm-hero-deco-1" />
        <div className="sm-hero-deco-2" />
        <div className="sm-hero-container">
          <div className="sm-hero-content">
            <span className="sm-hero-tag">Sitemap</span>
            <h1 className="sm-hero-title">
              Website <span>Sitemap</span>
            </h1>
            <p className="sm-hero-subtitle">
              A complete overview of all pages and sections available on
              the Noorrix Motors website. Use this sitemap to quickly
              navigate to any page you need.
            </p>
            <div className="sm-hero-badges">
              <div className="sm-hero-badge">
                <FaCheckCircle className="sm-hero-badge-icon" />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="sm-hero-badge">
                <FaSitemap className="sm-hero-badge-icon" />
                <span>Full Site Index</span>
              </div>
            </div>
          </div>

          <div className="sm-hero-visual" aria-hidden="true">
            <div className="sm-icon-ring sm-icon-ring-outer" />
            <div className="sm-icon-ring sm-icon-ring-mid" />
            <div className="sm-icon-core">
              <FaSitemap className="sm-icon-main" />
            </div>
          </div>
        </div>
      </section>

      {/* Intro card */}
      <section className="sm-intro-section">
        <div className="sm-intro-container">
          <div className="sm-intro-card">
            <div className="sm-intro-icon-wrapper">
              <FaSitemap />
            </div>
            <div className="sm-intro-text">
              <h2 className="sm-intro-heading">How to Use This Sitemap</h2>
              <p className="sm-intro-paragraph">
                This sitemap provides a structured list of all pages available
                on the Noorrix Motors website. Whether you're looking for a
                specific vehicle, service, or legal information, you can find
                direct links to every section of our site below.
              </p>
              <p className="sm-intro-paragraph">
                Pages are organised into three categories: main navigation
                pages, our vehicle and service pages, and legal and
                informational pages. Click any link to go directly to that page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Site sections grid */}
      <section className="sm-categories-section">
        <div className="sm-categories-container">
          <div className="sm-categories-header">
            <span className="sm-categories-tag">All Pages</span>
            <h2 className="sm-categories-title">
              Browse <span>All Sections</span>
            </h2>
            <div className="sm-categories-accent-bar" />
          </div>

          <div className="sm-categories-grid">
            {sitemapCategories.map((cat, catIndex) => (
              <div className="sm-category-card" key={catIndex}>
                <div className="sm-category-card-header">
                  <div className="sm-category-icon">{cat.icon}</div>
                  <div>
                    <span className="sm-category-tag">{cat.tag}</span>
                    <h3 className="sm-category-title">{cat.title}</h3>
                  </div>
                </div>
                <ul className="sm-link-list">
                  {cat.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="sm-link-item">
                      <Link href={link.path} className="sm-link">
                        <span className="sm-link-icon">{link.icon}</span>
                        <span className="sm-link-label">{link.label}</span>
                        <span className="sm-link-arrow">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="sm-contact-section">
        <div className="sm-contact-bg" />
        <div className="sm-contact-overlay" />
        <div className="sm-contact-top-accent" />
        <div className="sm-contact-container">
          <span className="sm-contact-tag">Need Help?</span>
          <h2 className="sm-contact-title">
            Can't Find What You're <span>Looking For?</span>
          </h2>
          <p className="sm-contact-subtitle">
            If you can't find what you're looking for on our website,
            our team is happy to help. Get in touch with us directly.
          </p>
          <div className="sm-contact-details">
            <div className="sm-contact-item">
              <FaEnvelope className="sm-contact-item-icon" />
              <div>
                <strong>Email</strong>
                <p>
                  <a href="mailto:info@noorrixmotors.co.uk" className="sm-contact-link">
                    info@noorrixmotors.co.uk
                  </a>
                </p>
              </div>
            </div>
            <div className="sm-contact-item">
              <FaPhone className="sm-contact-item-icon" />
              <div>
                <strong>Phone</strong>
                <p>
                  <a href="tel:07300503113" className="sm-contact-link">07300 503113</a> (WhatsApp)
                </p>
              </div>
            </div>
            <div className="sm-contact-item">
              <FaMapMarkerAlt className="sm-contact-item-icon" />
              <div>
                <strong>Address</strong>
                <p>
                  <a
                    href="https://maps.google.com/?q=16+Eastside+Cauldwell+Walk+Bedford+MK42+9DT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm-contact-link"
                  >
                    16 Eastside, Cauldwell Walk, Bedford MK42 9DT
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="sm-contact-buttons">
            <Link href="/contact" className="sm-contact-btn sm-contact-btn-primary">
              <FaEnvelope size={16} />
              Contact Us
            </Link>
            <Link href="/" className="sm-contact-btn sm-contact-btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <NoorrixFooter />
    </>
  );
}

export default Sitemap;
