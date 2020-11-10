import React, { useEffect } from "react";
import "./Navbar.css";

function Navbar({ conversionActive, setConversionActive, toggleNav }) {
  useEffect(() => {
    const links = document.querySelectorAll(".navbar > a[slide='true']");
    links.forEach((link) => link.addEventListener("click", slide));
    links.forEach((link) => link.addEventListener("click", toggleNav));
    window.onbeforeunload = function (event) {
      localStorage.setItem(
        "wasActive",
        document.querySelector(".navbar__--active").dataset.name
      );
    };
    window.onload = function (event) {
      links.forEach((link) => {
        if (link.dataset.name == localStorage.getItem("wasActive"))
          link.classList.add("navbar__--active");
        else link.classList.remove(".navbar__--active");
      });

      slide(null);
    };
  }, []);
  const slide = (
    event,
    backup = document.querySelector(".navbar__--active")
  ) => {
    const slides = [...document.querySelectorAll(".slide")];
    const links = document.querySelectorAll(".navbar > a[slide='true']");
    const willHide = slides.find((slide) => slide.classList.contains("on"));
    const willShow = slides.find((slide) =>
      slide.classList.contains(
        event ? event.target.dataset.name : backup.dataset.name
      )
    );
    if (willHide != willShow) {
      let transition;
      if (!event) {
        slides.forEach((slide) => {
          transition = slide.style.transition;
          slide.style.transition = "0s";
        });
      }
      willHide.style.transform = "translateX(-100%)";
      willShow.style.left = "100%";
      willShow.style.zIndex = 1;
      willShow.style.transform = "translateX(-100%)";
      links.forEach((link) => {
        link.removeEventListener("click", slide);
        if (event) {
          link == event?.target
            ? link.classList.add("navbar__--active")
            : link.classList.remove("navbar__--active");
        } else {
          link == backup
            ? link.classList.add("navbar__--active")
            : link.classList.remove("navbar__--active");
        }
      });

      slides.forEach((slide) =>
        slide != willShow && slide != willHide
          ? (slide.style.display = "none")
          : ""
      );

      setTimeout(() => {
        if (!event) {
          slides.forEach((slide) => {
            slide.style.transition = transition;
          });
        }
        slides.forEach((slide) => {
          slide == willShow
            ? slide.classList.add("on")
            : slide.classList.remove("on");
        });
        willHide.style.transform = "";
        willShow.style.left = "";
        willShow.style.zIndex = "";
        willShow.style.transform = "";
        slides.forEach((slide) =>
          slide != willShow && slide != willHide
            ? (slide.style.display = "inline-block")
            : ""
        );
        links.forEach((link) => link.addEventListener("click", slide));
      }, 600);
    }
  };

  const toggleConversionActive = () => {
    toggleNav();
    setConversionActive(!conversionActive);
  };

  return (
    <div className="navbar">
      <a
        href="#"
        title="Go to home page"
        data-name="home"
        className="navbar__--active"
        slide="true"
      >
        Home
      </a>
      <a
        href="#"
        title="Information about specific currencies"
        data-name="currency"
        slide="true"
      >
        Currency
      </a>
      <a
        href="#"
        title="Currency converter"
        data-name="conversion"
        onClick={toggleConversionActive}
        className={`${conversionActive ? "navbar__conversionLink" : ""}`}
      >
        Conversion
      </a>
    </div>
  );
}

export default Navbar;
