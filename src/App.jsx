import { useState } from "react";
import { Globe2 } from "lucide-react";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  const [language, setLanguage] = useState("English");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languages = ["English", "हिन्दी", "বাংলা", "मराठी"];

  return (
    <div className="portal-shell">
      <Header />

      <main className="portal-main">
        <div className="portal-content">
          <div className="bhashini-wrap">
            <button
              type="button"
              className="bhashini-trigger"
              aria-expanded={isLanguageOpen}
              aria-haspopup="listbox"
              onClick={() => setIsLanguageOpen((isOpen) => !isOpen)}
            >
              <Globe2 className="globe" aria-hidden="true" strokeWidth={1.8} />
              <span className="bhashini-script">
                अ<br />
                <b>A</b>
              </span>
              <span className="trigger-label">{language}</span>
            </button>
            {isLanguageOpen && (
              <div
                className="language-menu"
                role="listbox"
                aria-label="Select language"
              >
                {languages.map((option) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={language === option}
                    className={language === option ? "selected" : ""}
                    key={option}
                    onClick={() => {
                      setLanguage(option);
                      setIsLanguageOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <section
            className="empty-state"
            aria-label="Portal workspace placeholder"
          >
            <div className="empty-line" />
            <p>Secure document workspace</p>
            <span>Portal content will appear here</span>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
