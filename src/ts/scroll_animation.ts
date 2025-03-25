document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle") as HTMLElement | null;
    const mobileMenu = document.getElementById("mobile-menu") as HTMLElement | null;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () =>
            mobileMenu.classList.toggle("hidden")
        );
    }

    const observerOptions: IntersectionObserverInit = {
        threshold: 0.2,
        rootMargin: "0px",
    };

    const animationObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("visible", entry.isIntersecting);

                if (
                    entry.isIntersecting &&
                    entry.target instanceof HTMLElement &&
                    entry.target.dataset.transitionDelay
                ) {
                    entry.target.style.transitionDelay = entry.target.dataset.transitionDelay;
                } else if (entry.target instanceof HTMLElement) {
                    entry.target.style.transitionDelay = "0s";
                }
            });
        },
        observerOptions
    );

    const animatedElements = document.querySelectorAll<HTMLElement>(
        ".fade-in, .fade-in-left, .fade-in-right, .scale-in"
    );

    animatedElements.forEach((element) => {
        animationObserver.observe(element);
    });

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e: MouseEvent) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId) {
                const targetElement = document.querySelector(targetId) as HTMLElement | null;
                targetElement?.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    });
});
