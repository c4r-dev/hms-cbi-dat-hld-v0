"use client";

export default function FaviconButton() {
  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <button onClick={handleClick} className="favicon-button">
      <img src="/favicon.ico" alt="Favicon" className="favicon" />
    </button>
  );
}
