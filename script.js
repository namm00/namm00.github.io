"use strict";

const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeButton = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const toast = document.querySelector("#toast");

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // Website still works when storage is blocked by the browser.
    }
}

let toastTimer;
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* Reveal content as it enters the viewport. */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px" });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

/* Sticky header and mobile navigation. */
function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 12);
}

function closeMenu() {
    if (!menuButton || !navLinks) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Mở menu");
    navLinks.classList.remove("open");
}

menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Đóng menu" : "Mở menu");
    navLinks?.classList.toggle("open", willOpen);
});

navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("open")) return;
    if (!event.target.closest(".nav")) closeMenu();
});
window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
});
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* Theme persists between visits. */
function isLightTheme() {
    return root.dataset.theme === "light";
}

function updateThemeControls() {
    const light = isLightTheme();
    themeButton?.setAttribute("aria-label", light ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng");
    if (themeMeta) themeMeta.content = light ? "#f6f9f8" : "#07111f";
}

themeButton?.addEventListener("click", () => {
    const nextTheme = isLightTheme() ? "dark" : "light";
    if (nextTheme === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    try {
        localStorage.setItem("safelayer-theme", nextTheme);
    } catch (error) {
        // Theme still changes for the current visit when storage is blocked.
    }
    updateThemeControls();
});
updateThemeControls();

/* Highlight the navigation item for the current section. */
const trackedSections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navAnchors.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
        });
    }, { rootMargin: "-25% 0px -60%", threshold: [0, 0.15, 0.5] });
    trackedSections.forEach((section) => sectionObserver.observe(section));
}

/* Topic search and category filters. */
const topicSearch = document.querySelector("#topic-search");
const filterButtons = document.querySelectorAll(".filter-button");
const topicCards = document.querySelectorAll(".topic-card");
const emptyState = document.querySelector("#empty-state");
let activeFilter = "all";

function normalizeText(value) {
    return value.toLocaleLowerCase("vi")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");
}

function filterTopics() {
    const query = normalizeText(topicSearch?.value.trim() || "");
    let visibleCount = 0;

    topicCards.forEach((card) => {
        const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
        const searchContent = `${card.dataset.search || ""} ${card.textContent}`;
        const searchMatch = !query || normalizeText(searchContent).includes(query);
        const shouldShow = categoryMatch && searchMatch;
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        filterButtons.forEach((item) => item.classList.toggle("active", item === button));
        filterTopics();
    });
});
topicSearch?.addEventListener("input", filterTopics);

/* Small decision lab. */
const labOptions = document.querySelectorAll("#lab-options button");
const labResult = document.querySelector("#lab-result");
const labMessages = {
    unsafe: "<strong>Rủi ro cao.</strong> Thiết kế này trao quyền tài chính không giới hạn cho một thành phần có thể bị lỗi hoặc bị thao túng. Hãy thêm hạn mức, phê duyệt và audit log.",
    safer: "<strong>Lựa chọn an toàn hơn.</strong> Agent vẫn giúp tự động hóa phần chuẩn bị, trong khi giới hạn tiền, log và con người làm giảm tác động nếu model sai."
};

labOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const result = button.dataset.result;
        labOptions.forEach((item) => item.classList.toggle("selected", item === button));
        if (!labResult || !result) return;
        labResult.hidden = false;
        labResult.className = `lab-result ${result}`;
        labResult.innerHTML = labMessages[result];
    });
});

/* Checklist: store only checkbox IDs, never personal data. */
const checklist = document.querySelector("#safety-checklist");
const checklistInputs = checklist?.querySelectorAll('input[type="checkbox"]') || [];
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const resetChecklist = document.querySelector("#reset-checklist");
const savedChecks = readStorage("safelayer-checklist", []);

if (Array.isArray(savedChecks)) {
    checklistInputs.forEach((input) => {
        input.checked = savedChecks.includes(input.value);
    });
}

function updateProgress({ announceCompletion = false } = {}) {
    const checked = [...checklistInputs].filter((input) => input.checked);
    const total = checklistInputs.length;
    const percent = total ? (checked.length / total) * 100 : 0;
    if (progressText) progressText.textContent = `${checked.length} / ${total}`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    writeStorage("safelayer-checklist", checked.map((input) => input.value));
    if (announceCompletion && total > 0 && checked.length === total) {
        showToast("Hoàn thành checklist — sẵn sàng cho bước review!");
    }
}

checklistInputs.forEach((input) => input.addEventListener("change", () => updateProgress({ announceCompletion: true })));
resetChecklist?.addEventListener("click", () => {
    checklistInputs.forEach((input) => { input.checked = false; });
    updateProgress();
    showToast("Đã đặt lại checklist");
});
updateProgress();

/* Accessible accordion. */
document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const willOpen = button.getAttribute("aria-expanded") !== "true";
        item?.classList.toggle("open", willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
    });
});

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());
