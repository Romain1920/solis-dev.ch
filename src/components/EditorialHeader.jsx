import { useCallback, useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import solisLogo from "../../assets/solis-logo-nav.png";
import solisLogoWhite from "../../assets/solis-logo-white.png";
import { useTheme } from "./ThemeProvider";
import "../editorial-header.css";

const DEFAULT_EDITORIAL_NAV_ITEMS = Object.freeze([
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/equipe", label: "Équipe" },
  { href: "/#contact", label: "Contact" },
]);

const DEFAULT_EDITORIAL_SERVICE_ITEMS = Object.freeze([
  {
    href: "/services#site-internet-sur-mesure",
    label: "Site internet sur mesure",
  },
  { href: "/services#application-mobile", label: "Application mobile" },
  { href: "/services#logiciels-metiers", label: "Logiciels métiers" },
]);

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getCurrentPath = () => {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname.replace(/\/+$/, "") || "/";
};

const getCurrentHash = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hash;
};

const isCurrentDestination = (href, currentPath, currentHash) => {
  const [rawPath, rawHash] = href.split("#");
  const itemPath = (rawPath || currentPath).replace(/\/+$/, "") || "/";
  const itemHash = rawHash ? `#${rawHash}` : "";

  if (itemHash) {
    return currentPath === itemPath && currentHash === itemHash;
  }

  if (itemPath === "/") {
    return currentPath === itemPath && !currentHash;
  }

  return currentPath === itemPath;
};

function ThemeGlyph({ theme }) {
  if (theme === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="3.25" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.42 1.42M17.3 17.3l1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.1 15.2A8.55 8.55 0 0 1 8.8 3.9 8.56 8.56 0 1 0 20.1 15.2Z" />
    </svg>
  );
}

function Logo({ inverse = false }) {
  return (
    <span className="editorial-header__logo-frame" aria-hidden="true">
      <img
        className={`editorial-header__logo-image${inverse ? " editorial-header__logo-image--inverse" : ""}`}
        src={inverse ? solisLogoWhite : solisLogo}
        alt=""
        decoding="async"
      />
    </span>
  );
}

function ThemeToggle({ inverse = false }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const nextThemeLabel = resolvedTheme === "dark" ? "JOUR" : "NUIT";
  const accessibleLabel = resolvedTheme === "dark"
    ? "Passer au thème clair"
    : "Passer au thème sombre";

  return (
    <button
      className={`editorial-header__theme-toggle${inverse ? " editorial-header__theme-toggle--inverse" : ""}`}
      type="button"
      onClick={toggleTheme}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      <span>{nextThemeLabel}</span>
      <ThemeGlyph theme={resolvedTheme} />
    </button>
  );
}

/**
 * Global editorial header. Pass the app's internal-navigation handler through
 * `onNavigate`, and use `onScrollLockChange` to stop/start Lenis when the menu
 * opens and closes.
 */
export function EditorialHeader({
  currentPath = getCurrentPath(),
  currentHash = getCurrentHash(),
  navigationItems = DEFAULT_EDITORIAL_NAV_ITEMS,
  serviceItems = DEFAULT_EDITORIAL_SERVICE_ITEMS,
  onNavigate,
  onMenuOpenChange,
  onScrollLockChange,
  lockDocumentScroll = true,
  className = "",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { preference, resolvedTheme, setTheme, resetToSystem } = useTheme();
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const returnFocusRef = useRef(null);
  const focusReturnTimeoutRef = useRef(null);
  const scrollLockCallbackRef = useRef(onScrollLockChange);
  const menuChangeCallbackRef = useRef(onMenuOpenChange);
  const dialogId = useId();
  const dialogTitleId = useId();
  const themeGroupId = useId();

  useEffect(() => {
    scrollLockCallbackRef.current = onScrollLockChange;
  }, [onScrollLockChange]);

  useEffect(() => {
    menuChangeCallbackRef.current = onMenuOpenChange;
  }, [onMenuOpenChange]);

  const closeMenu = useCallback(() => {
    flushSync(() => {
      setIsMenuOpen(false);
    });

    const focusTarget = returnFocusRef.current ?? menuButtonRef.current;
    focusTarget?.focus({ preventScroll: true });

    if (focusReturnTimeoutRef.current) {
      window.clearTimeout(focusReturnTimeoutRef.current);
    }

    focusReturnTimeoutRef.current = window.setTimeout(() => {
      focusTarget?.focus({ preventScroll: true });
      focusReturnTimeoutRef.current = null;
    }, 220);
  }, []);

  const openMenu = useCallback(() => {
    returnFocusRef.current = menuButtonRef.current;
    setIsMenuOpen(true);
  }, []);

  const handleNavigation = useCallback(
    (event) => {
      closeMenu();
      onNavigate?.(event);
    },
    [closeMenu, onNavigate]
  );

  useEffect(() => {
    menuChangeCallbackRef.current?.(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector("[data-menu-initial-focus]")?.focus({
        preventScroll: true,
      });
    });

    const handleMenuKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        menuRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? []
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.hasAttribute("disabled") &&
          element.getClientRects().length > 0
      );

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !menuRef.current?.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (activeElement === lastElement || !menuRef.current?.contains(activeElement))) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleMenuKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleMenuKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(
    () => () => {
      if (focusReturnTimeoutRef.current) {
        window.clearTimeout(focusReturnTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);

    root.classList.add("editorial-menu-open");

    if (lockDocumentScroll) {
      root.style.overflow = "hidden";
      body.style.overflow = "hidden";

      if (scrollbarGap > 0) {
        body.style.paddingRight = `${scrollbarGap}px`;
      }
    }

    scrollLockCallbackRef.current?.(true);
    window.dispatchEvent(
      new CustomEvent("solis:menu-scroll-lock", { detail: { locked: true } })
    );

    return () => {
      root.classList.remove("editorial-menu-open");

      if (lockDocumentScroll) {
        root.style.overflow = previousRootOverflow;
        body.style.overflow = previousBodyOverflow;
        body.style.paddingRight = previousBodyPaddingRight;
      }

      scrollLockCallbackRef.current?.(false);
      window.dispatchEvent(
        new CustomEvent("solis:menu-scroll-lock", { detail: { locked: false } })
      );
    };
  }, [isMenuOpen, lockDocumentScroll]);

  const headerClassName = [
    "editorial-header",
    isMenuOpen ? "editorial-header--menu-open" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName} ref={headerRef}>
      <div className="editorial-header__bar" inert={isMenuOpen}>
        <a
          className="editorial-header__brand"
          href="/"
          aria-label="SOLIS Développement — Accueil"
          onClick={handleNavigation}
        >
          <Logo inverse={resolvedTheme === "dark"} />
        </a>

        <div className="editorial-header__actions">
          <ThemeToggle />
          <button
            className="editorial-header__menu-button"
            type="button"
            ref={menuButtonRef}
            onClick={openMenu}
            aria-expanded={isMenuOpen}
            aria-controls={dialogId}
            aria-haspopup="dialog"
            aria-label="Ouvrir le menu"
          >
            <span className="editorial-header__menu-label">MENU</span>
            <span className="editorial-header__menu-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        className="editorial-menu"
        id={dialogId}
        ref={menuRef}
        role="dialog"
        aria-modal={isMenuOpen ? "true" : undefined}
        aria-labelledby={dialogTitleId}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className="editorial-menu__ambient" aria-hidden="true" />

        <div className="editorial-menu__bar">
          <a
            className="editorial-header__brand"
            href="/"
            aria-label="SOLIS Développement — Accueil"
            onClick={handleNavigation}
          >
            <Logo inverse />
          </a>

          <div className="editorial-header__actions">
            <ThemeToggle inverse />
            <button
              className="editorial-header__menu-button editorial-header__menu-button--close"
              type="button"
              onClick={closeMenu}
              aria-label="Fermer le menu"
              aria-controls={dialogId}
            >
              <span className="editorial-header__menu-label">FERMER</span>
              <span className="editorial-header__menu-icon" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>

        <div className="editorial-menu__content">
          <h2 className="editorial-menu__sr-only" id={dialogTitleId}>
            Navigation principale
          </h2>

          <nav className="editorial-menu__primary" aria-label="Navigation principale">
            <ol>
              {navigationItems.map((item, index) => {
                const isCurrent = isCurrentDestination(
                  item.href,
                  currentPath,
                  currentHash
                );

                return (
                  <li
                    className={isCurrent ? "editorial-menu__item--current" : undefined}
                    key={item.href}
                    style={{ "--menu-order": index }}
                  >
                    <span className="editorial-menu__index" aria-hidden="true">
                      / {String(index + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={item.href}
                      onClick={handleNavigation}
                      aria-current={isCurrent ? "page" : undefined}
                      data-menu-initial-focus={index === 0 ? "true" : undefined}
                    >
                      <span>{item.label}</span>
                      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                        <path d="M5 16h20M18 9l7 7-7 7" />
                      </svg>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="editorial-menu__secondary">
            <section className="editorial-menu__services" aria-labelledby={`${dialogTitleId}-services`}>
              <p className="editorial-menu__eyebrow" id={`${dialogTitleId}-services`}>
                / SERVICES
              </p>
              <ul>
                {serviceItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={handleNavigation}
                      aria-current={
                        isCurrentDestination(item.href, currentPath, currentHash)
                          ? "location"
                          : undefined
                      }
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <address className="editorial-menu__contact">
              <p className="editorial-menu__eyebrow">/ CONTACT</p>
              <a href="mailto:info@solis.li">info@solis.li</a>
              <a href="tel:+41798401663">+41 79 840 16 63</a>
              <span>Martigny · Suisse</span>
            </address>

            <section className="editorial-menu__appearance" aria-labelledby={themeGroupId}>
              <p className="editorial-menu__eyebrow" id={themeGroupId}>
                / APPARENCE
              </p>
              <div className="editorial-menu__theme-options" role="group" aria-labelledby={themeGroupId}>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  aria-pressed={preference === "light"}
                >
                  Clair
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  aria-pressed={preference === "dark"}
                >
                  Sombre
                </button>
                <button
                  type="button"
                  onClick={resetToSystem}
                  aria-pressed={preference === "system"}
                >
                  Système
                </button>
              </div>
            </section>
          </div>

          <p className="editorial-menu__signature" aria-hidden="true">
            SOLIS · DÉVELOPPEMENT INFORMATIQUE
          </p>
        </div>
      </div>
    </header>
  );
}

export default EditorialHeader;
