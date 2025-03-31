(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("DOMContentLoaded", (() => {
        const progressContainer = document.createElement("div");
        progressContainer.className = "scroll-progress-container";
        const progressBar = document.createElement("div");
        progressBar.className = "scroll-progress";
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        const style = document.createElement("style");
        style.textContent = `\n    .scroll-progress-container {\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 5px;\n      background: rgba(var(--color-gray-200-rgb), 0.3);\n      z-index: 9999;\n    }\n    .scroll-progress {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 0;\n      height: 100%;\n      background: var(--color-main);\n      transition: width 0.1s ease-out;\n      box-shadow: 0 2px 4px var(--color-main);\n      border-radius: 0 10px 10px 0;\n    }\n  `;
        document.head.appendChild(style);
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = scrolled / documentHeight * 100;
            requestAnimationFrame((() => {
                progressBar.style.width = `${progress}%`;
                progressBar.style.boxShadow = scrolled > 0 ? "0 2px 8px var(--color-main)" : "0 2px 4px var(--color-main)";
            }));
        }
        window.addEventListener("scroll", updateProgress);
        window.addEventListener("resize", updateProgress);
        updateProgress();
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const modals = document.querySelectorAll(".modal");
        let activeModal = null;
        let player = null;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = function() {
            const trailerModal = document.getElementById("trailer");
            if (trailerModal) {
                const iframe = trailerModal.querySelector("iframe");
                if (iframe) player = new YT.Player(iframe, {
                    events: {
                        onReady: onPlayerReady
                    }
                });
            }
        };
        function onPlayerReady(event) {
            player = event.target;
        }
        document.addEventListener("click", (e => {
            const trigger = e.target.closest("[data-modal]");
            if (trigger) {
                const modalId = trigger.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                    openModal(modal);
                    e.preventDefault();
                }
            }
        }));
        modals.forEach((modal => {
            const closeBtn = modal.querySelector(".modal__close");
            const overlay = modal.querySelector(".modal__overlay");
            if (closeBtn) closeBtn.addEventListener("click", (() => closeModal(modal)));
            if (overlay) overlay.addEventListener("click", (() => closeModal(modal)));
        }));
        document.addEventListener("keydown", (e => {
            if (e.key === "Escape" && activeModal) closeModal(activeModal);
        }));
        function openModal(modal) {
            if (activeModal) closeModal(activeModal);
            activeModal = modal;
            modal.classList.add("is-active");
            document.body.style.overflow = "hidden";
        }
        function closeModal(modal) {
            modal.classList.remove("is-active");
            document.body.style.overflow = "";
            if (player && typeof player.pauseVideo === "function") player.pauseVideo();
            activeModal = null;
        }
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const gallery = {
            modal: document.getElementById("gallery"),
            image: document.querySelector(".gallery-modal__image"),
            counter: document.querySelector(".gallery-modal__counter"),
            closeBtn: document.querySelector(".gallery-modal__close"),
            prevBtn: document.querySelector(".gallery-modal__nav--prev"),
            nextBtn: document.querySelector(".gallery-modal__nav--next"),
            images: [],
            currentIndex: 0,
            touchStartX: 0,
            touchEndX: 0
        };
        const initGallery = () => {
            gallery.images = Array.from(document.querySelectorAll(".screenshots__item img")).map((img => ({
                src: img.src,
                alt: img.alt
            })));
            document.querySelectorAll(".screenshots__item").forEach(((item, index) => {
                item.addEventListener("click", (() => openGallery(index)));
            }));
        };
        const openGallery = index => {
            gallery.currentIndex = index;
            updateGalleryImage();
            gallery.modal.classList.add("is-active");
            document.body.style.overflow = "hidden";
            addGalleryListeners();
        };
        const closeGallery = () => {
            gallery.modal.classList.remove("is-active");
            document.body.style.overflow = "";
            removeGalleryListeners();
        };
        const updateGalleryImage = () => {
            const image = gallery.images[gallery.currentIndex];
            gallery.image.src = image.src;
            gallery.image.alt = image.alt;
            gallery.counter.textContent = `${gallery.currentIndex + 1} / ${gallery.images.length}`;
            gallery.prevBtn.style.visibility = gallery.currentIndex > 0 ? "visible" : "hidden";
            gallery.nextBtn.style.visibility = gallery.currentIndex < gallery.images.length - 1 ? "visible" : "hidden";
        };
        const prevImage = () => {
            if (gallery.currentIndex > 0) {
                gallery.currentIndex--;
                updateGalleryImage();
            }
        };
        const nextImage = () => {
            if (gallery.currentIndex < gallery.images.length - 1) {
                gallery.currentIndex++;
                updateGalleryImage();
            }
        };
        const handleKeyboard = e => {
            switch (e.key) {
              case "ArrowLeft":
                prevImage();
                break;

              case "ArrowRight":
                nextImage();
                break;

              case "Escape":
                closeGallery();
                break;
            }
        };
        const handleTouchStart = e => {
            gallery.touchStartX = e.touches[0].clientX;
        };
        const handleTouchMove = e => {
            gallery.touchEndX = e.touches[0].clientX;
        };
        const handleTouchEnd = () => {
            const touchDiff = gallery.touchStartX - gallery.touchEndX;
            if (Math.abs(touchDiff) > 50) if (touchDiff > 0) nextImage(); else prevImage();
        };
        const addGalleryListeners = () => {
            document.addEventListener("keydown", handleKeyboard);
            gallery.modal.addEventListener("touchstart", handleTouchStart);
            gallery.modal.addEventListener("touchmove", handleTouchMove);
            gallery.modal.addEventListener("touchend", handleTouchEnd);
        };
        const removeGalleryListeners = () => {
            document.removeEventListener("keydown", handleKeyboard);
            gallery.modal.removeEventListener("touchstart", handleTouchStart);
            gallery.modal.removeEventListener("touchmove", handleTouchMove);
            gallery.modal.removeEventListener("touchend", handleTouchEnd);
        };
        if (gallery.modal) {
            initGallery();
            gallery.closeBtn.addEventListener("click", closeGallery);
            gallery.prevBtn.addEventListener("click", prevImage);
            gallery.nextBtn.addEventListener("click", nextImage);
            gallery.modal.querySelector(".gallery-modal__overlay").addEventListener("click", closeGallery);
        }
    }));
    window["FLS"] = true;
    isWebp();
    addTouchClass();
    addLoadedClass();
    menuInit();
})();