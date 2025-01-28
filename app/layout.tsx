import ThemeRegistry from "./ThemeRegistry";
import "./globals.css";

export const metadata = {
  title: "Data Selection App",
  description: "A Next.js app for selecting datasets for Training and Testing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeRegistry>
          {/* Header */}
          <header className="header">
            <img src="/favicon.ico" alt="Favicon" className="favicon" />
            <h1 className="title">
              We’ve got this model - we think it performs great. <br />
              Here's how we selected the training and testing data for it.
            </h1>
          </header>

          {/* Main Content */}
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
