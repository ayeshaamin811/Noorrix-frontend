"use client";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import HeroFilter from "../HeroFilter/Filter";
import "./Hero.css";

const socialLinks = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/noorrixmotors/", label: "Facebook" },
  { icon: <FaYoutube />, href: "#", label: "YouTube" },
];

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      {/* Background Image */}
      <div className="hero-bg" />
      {/* Dark Overlay */}
      <div className="hero-overlay" />

      {/* 30 / 70 inner grid */}
      <div className="hero-inner">

        {/* LEFT – Filter (30%) */}
        <div className="hero-filter-col">
          <HeroFilter />
        </div>

        {/* RIGHT – Text content (70%) */}
        <div className="hero-content">
          <h1 className="hero-title">
            Discover, Compare &amp; <br />
            Drive – All in One Place
          </h1>
          <p className="hero-subtitle">
            Browse a wide selection of vehicles with transparent pricing and hassle-free service.
          </p>
        </div>

      </div>

      {/* Social Sidebar */}
      <div className="social-sidebar">
        {socialLinks.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="social-icon"
            aria-label={item.label}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </section>
  );
}