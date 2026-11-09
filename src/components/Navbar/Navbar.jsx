"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, getDisplayName } from "../../context/AuthContext";
import { useFavourites } from "../../context/FavouritesContext";
import "./Navbar.css";
const logo = "/assets/images/noorix_logo.jpg";
import { getFilters } from "../../lib/cars";
import { brandSlug } from "../../lib/format";
import {
  FaBars,
  FaTimes,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaHome,
  FaCar,
  FaShuttleVan,
  FaTh,
  FaWrench,
  FaPhone,
  FaChevronDown,
  FaChevronLeft,
  FaExchangeAlt,
  FaTruck,
  FaTools,
  FaShieldAlt,
  FaCertificate,
  FaHeart,
  FaPhoneVolume,
  FaPhoneAlt,
  FaCarSide,
  FaTruckMoving,
  FaSprayCan,
  FaHammer,
  FaInfoCircle,
  FaTag,
  FaUserCircle,
  FaSignOutAlt,
  FaCalendarAlt 
} from "react-icons/fa";

// ─── Mobile Contact Dropdown ──────────────────────────────────────────────────
function MobileContactDropdown({ open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="mobile-contact-backdrop" onClick={onClose} />
      )}

      {/* Dropdown Panel */}
      <div className={`mobile-contact-dropdown${open ? " open" : ""}`}>
        <h3 className="mobile-contact-title">Contact Information</h3>
        <p className="mobile-contact-subtitle">
          Click any of the numbers below to call us directly.
        </p>

        <div className="mobile-contact-numbers">
          {/* Number 1 */}
          <a href="tel:07300503113" className="mobile-contact-num-item">
            <FaPhoneVolume size={22} className="mobile-contact-num-icon" />
            <span>07300503113</span>
          </a>
        </div>

        <button className="mobile-contact-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}

// ─── Services Sub-Panel ───────────────────────────────────────────────────────
function ServicesPanel({ open, onBack }) {
const items = [
  { label: "Part Exchange", icon: FaExchangeAlt },
  { label: "Vehicle Sourcing", icon: FaCarSide },
  { label: "Delivery", icon: FaTruckMoving },
  { label: "Servicing", icon: FaTools },
  { label: "Dents and Paints", icon: FaSprayCan },
  { label: "Warranty", icon: FaShieldAlt },
];

  return (
    <div className={`services-panel${open ? " open" : ""}`}>
      <div className="services-header">
        <FaWrench size={18} className="services-icon" />
        <button className="services-back-btn" onClick={onBack} aria-label="Back">
          <FaChevronLeft size={14} />
        </button>
        <span className="services-title">Services</span>
      </div>
      <div className="services-list">
        {items.map(({ label, icon: Icon }) => {
          let linkTo = "#";
          if (label === "Part Exchange") linkTo = "/part-exchange";
          if (label === "Vehicle Sourcing") linkTo = "/vehicle-sourcing";
          if (label === "Delivery") linkTo = "/delivery";
          if (label === "Servicing") linkTo = "/servicing";
          if (label === "Dents and Paints") linkTo = "/dents-paints";
          if (label === "Warranty") linkTo = "/warranty";
          return (
            <Link href={linkTo} className="services-list-item" key={label}>
              <Icon size={16} className="service-item-icon" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Brands Sub-Panel ─────────────────────────────────────────────────────────
function BrandsPanel({ open, onBack }) {
  const [sortedMakes, setSortedMakes] = useState([]);

  // Brand list comes from the live /api/filters/ inventory; fetched the first
  // time the user opens the Used Cars panel.
  useEffect(() => {
    if (!open || sortedMakes.length) return;
    let active = true;
    getFilters().then((f) => {
      if (active && Array.isArray(f?.makes)) setSortedMakes([...f.makes].sort());
    });
    return () => { active = false; };
  }, [open, sortedMakes.length]);

  return (
    <div className={`services-panel${open ? " open" : ""}`}>
      <div className="services-header">
        <FaCar size={18} className="services-icon" />
        <button className="services-back-btn" onClick={onBack} aria-label="Back">
          <FaChevronLeft size={14} />
        </button>
        <span className="services-title">Used Cars</span>
      </div>
      <div className="services-list brands-list">
        {sortedMakes.map((make) => (
          <Link
            href={`/used-cars/${brandSlug(make)}`}
            className="services-list-item"
            key={make}
          >
            <FaCarSide size={16} className="service-item-icon" />
            <span>{make}</span>
          </Link>
        ))}
      </div>
      <Link href="/stock" className="services-list-item brands-view-all brands-view-all-footer">
        <FaTh size={16} className="service-item-icon" />
        <span>View all cars</span>
      </Link>
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
function NavDrawer({ open, onClose }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const { count: favCount } = useFavourites();

  const handleClose = () => {
    setServicesOpen(false);
    setBrandsOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className={`drawer-overlay${open ? " open" : ""}`}
        onClick={handleClose}
      />
      <div className={`drawer-panel${open ? " open" : ""}`}>
        <div className="drawer-header">
          <button className="drawer-close-btn" onClick={handleClose} aria-label="Close menu">
            <FaTimes size={20} color="white" />
            <span className="drawer-close-label">Menu</span>
          </button>
          <Link href="/" className="flex items-center justify-center logo">
            <img src={logo} alt="ACC Logo" className="w-14 h-14 object-contain" />
          </Link>
        </div>

        <nav className="drawer-nav">
          <Link href="/" className="drawer-nav-home">
            <FaHome size={18} color="white" />
            <span>Home</span>
          </Link>
          <div
            className="drawer-nav-item"
            onClick={() => setBrandsOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setBrandsOpen(true)}
          >
            <FaCar size={18} className="nav-icon" />
            <span>Used Cars</span>
            <FaChevronDown size={12} className="nav-chevron" />
          </div>
          <Link href="/sell-my-car" className="drawer-nav-sell">
            <span>Looking to sell?</span>
          </Link>
          <div
            className="drawer-nav-item"
            onClick={() => setServicesOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setServicesOpen(true)}
          >
            <FaWrench size={18} className="nav-icon" />
            <span>Services</span>
            <FaChevronDown size={12} className="nav-chevron" />
          </div>
          <Link href="/favourites" className="drawer-nav-item">
            <FaHeart size={18} className="nav-icon" />
            <span>Favourites</span>
            {favCount > 0 && <span className="drawer-fav-badge">{favCount}</span>}
          </Link>
          <Link href="/about" className="drawer-nav-item">
            <FaInfoCircle size={18} className="nav-icon" />
            <span>About</span>
          </Link>
          <Link href="/appointment" className="drawer-nav-item">
            <FaCalendarAlt size={18} className="nav-icon" />
            <span>Book an Appointment</span>
          </Link>
          <Link href="/stock" className="drawer-nav-item">
            <FaTh size={18} className="nav-icon" />
            <span>Our Stock</span>
          </Link>
          <Link href="/contact" className="drawer-nav-item">
            <FaPhone size={18} className="nav-icon" />
            <span>Contact</span>
          </Link>
          <Link href="/sell-my-car" className="drawer-nav-item">
            <FaTag size={18} className="nav-icon" />
            <span>Sell your car</span>
          </Link>
        </nav>

        <ServicesPanel open={servicesOpen} onBack={() => setServicesOpen(false)} />
        <BrandsPanel open={brandsOpen} onBack={() => setBrandsOpen(false)} />
      </div>
    </>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function AffordableCarCentreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const lastScrollY = useRef(0);
  const hiddenRef = useRef(false);
  const SCROLL_THRESHOLD = 80;

  const router = useRouter();
  const { user, logout } = useAuth();
  const { count: favCount } = useFavourites();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  // Close the user dropdown when clicking outside of it.
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      let next;

      if (currentScrollY < SCROLL_THRESHOLD) {
        next = false;
      } else if (currentScrollY > lastScrollY.current) {
        next = true;
      } else {
        next = false;
      }

      if (next !== hiddenRef.current) {
        hiddenRef.current = next;
        setHidden(next);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`acc-header w-full acc-header-sticky${hidden ? " acc-header-hidden" : ""}`}>
        <div className="flex items-stretch w-full" style={{ minHeight: 72 }}>

          {/* Menu Button */}
          <button
            className="acc-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars size={20} color="white" />
            <span className="acc-menu-label">Menu</span>
          </button>

          {/* Logo - links to home */}
          <Link href="/" className="flex items-center justify-center logo">
            <img src={logo} alt="ACC Logo" className="w-14 h-14 object-contain" />
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ─── Right Side ─────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 sm:px-6">

            {/* Favourites — desktop only */}
            <Link href="/favourites" className="acc-icon-outline-btn acc-desktop-only" aria-label="Favourites">
              <FaHeart size={16} />
              {favCount > 0 && <span className="acc-fav-badge">{favCount}</span>}
            </Link>

            {/* Reviews — desktop only */}
            <button className="acc-reviews-btn acc-desktop-only">Reviews</button>

            {/* Login / Account — desktop only */}
            {user ? (
              <div className="acc-user-menu acc-desktop-only" ref={userMenuRef}>
                <button
                  className="acc-user-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <FaUserCircle size={18} />
                  <span className="acc-user-name">{getDisplayName(user)}</span>
                  <FaChevronDown size={11} className={`acc-user-caret${userMenuOpen ? " open" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="acc-user-dropdown">
                    {user.email && <div className="acc-user-email">{user.email}</div>}
                    <button className="acc-user-logout" onClick={handleLogout}>
                      <FaSignOutAlt size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="acc-login-btn acc-desktop-only">Login</Link>
            )}

            {/* Contact Us — desktop only */}
            <Link href="/contact" className="acc-contact-us-btn acc-desktop-only">Contact Us</Link>

            {/* Phone Numbers — desktop only */}
            <div className="acc-desktop-only acc-phone-block">
              <a href="tel:07300503113" className="flex items-center gap-2 acc-phone-link">
                <FaPhoneVolume size={13} color="#fff" />
                <span className="acc-contact-number">07300503113</span>
              </a>
            </div>

            {/* WhatsApp — always visible */}
            <a
              href="https://wa.me/447300503113"
              target="_blank"
              rel="noopener noreferrer"
              className="acc-social-btn"
              style={{ backgroundColor: "#25D366" }}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>

            {/* Phone icon — mobile only */}
            <button
              className="acc-mobile-icon-btn acc-mobile-only hidden"
              style={{ backgroundColor: "#6c5ce7" }}
              onClick={() => setContactOpen((v) => !v)}
              aria-label="Call us"
            >
              <FaPhoneAlt size={17} color="#fff" />
            </button>

            {/* Heart icon — mobile only */}
            <Link
              href="/favourites"
              className="acc-mobile-icon-btn acc-mobile-only acc-mobile-heart hidden"
              aria-label="Saved"
            >
              <FaHeart size={17} color="#6c5ce7" />
              {favCount > 0 && <span className="acc-fav-badge">{favCount}</span>}
            </Link>

          </div>
        </div>

        {/* Mobile Contact Dropdown */}
        <MobileContactDropdown
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      </header>

      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}