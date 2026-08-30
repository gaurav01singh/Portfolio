/**
 * ProjectModal.js
 * Interactive Multi-Image Gallery & Project Showcase Modal Overlay
 */

export class ProjectModal {
  constructor() {
    this.modalEl = null;
    this.currentProject = null;
    this.currentImageIndex = 0;
    this.isOpen = false;
    this.onCloseCallback = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.initDOM();
  }

  initDOM() {
    if (typeof document === "undefined") return;
    if (document.getElementById("project-gallery-modal")) {
      this.modalEl = document.getElementById("project-gallery-modal");
      return;
    }

    const modal = document.createElement("div");
    modal.id = "project-gallery-modal";
    modal.className = "project-modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="project-modal-container" id="project-modal-container">
        <!-- Close Button -->
        <button class="project-modal-close-btn" id="modal-close-btn" aria-label="Close project modal">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Modal Header -->
        <header class="project-modal-header">
          <div class="project-modal-tags-row">
            <span class="project-modal-badge" id="modal-engine-tag">UNITY</span>
            <span class="project-modal-type-badge" id="modal-type-tag">2D ARCADE</span>
          </div>
          <h2 class="project-modal-title" id="modal-title">Project Title</h2>
        </header>

        <!-- Main Body: Gallery (Left) & Info (Right) -->
        <div class="project-modal-body">
          <!-- LEFT: Multi-Image Gallery Showcase -->
          <div class="project-modal-gallery">
            <div class="project-main-image-viewport" id="modal-img-viewport">
              <img id="modal-main-img" class="project-main-img" src="" alt="Project Screenshot" />
              
              <!-- Image Overlay Counter -->
              <div class="gallery-img-counter-badge" id="modal-img-counter">01 / 03</div>
              
              <!-- Previous / Next Controls -->
              <button class="gallery-nav-btn gallery-prev-btn" id="modal-prev-btn" aria-label="Previous screenshot">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button class="gallery-nav-btn gallery-next-btn" id="modal-next-btn" aria-label="Next screenshot">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <!-- Active Image Caption -->
            <div class="gallery-caption-box">
              <h4 class="gallery-caption-title" id="modal-img-title">Screenshot Title</h4>
              <p class="gallery-caption-desc" id="modal-img-desc">Screenshot description and technical context.</p>
            </div>

            <!-- Interactive Thumbnails Strip -->
            <div class="gallery-thumbnails-strip" id="modal-thumbnails-strip" role="tablist">
              <!-- Dynamically populated thumbnail buttons -->
            </div>
          </div>

          <!-- RIGHT: Project Dossier & Details -->
          <div class="project-modal-info">
            <div class="info-section">
              <h3 class="info-section-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                PROJECT OVERVIEW
              </h3>
              <ul class="project-bullets-list" id="modal-bullets-list">
                <!-- Bullets populated dynamically -->
              </ul>
            </div>

            <div class="info-section">
              <h3 class="info-section-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                TECHNOLOGIES & TOOLS
              </h3>
              <div class="tech-stack-chips" id="modal-stack-chips">
                <!-- Chips populated dynamically -->
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="project-modal-actions" id="modal-actions-row">
              <a id="modal-live-link" class="modal-primary-btn" href="#" target="_blank" rel="noopener noreferrer">
                <span>LAUNCH PROJECT / LIVE DEMO</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Attach DOM event handlers
    const closeBtn = modal.querySelector("#modal-close-btn");
    closeBtn.addEventListener("click", () => this.close());

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.close();
      }
    });

    const prevBtn = modal.querySelector("#modal-prev-btn");
    prevBtn.addEventListener("click", () => this.prevImage());

    const nextBtn = modal.querySelector("#modal-next-btn");
    nextBtn.addEventListener("click", () => this.nextImage());
  }

  open(project, onClose = null) {
    if (!this.modalEl) this.initDOM();
    this.currentProject = project;
    this.currentImageIndex = 0;
    this.onCloseCallback = onClose;

    const pColor = project.color
      ? typeof project.color === "number"
        ? `#${project.color.toString(16).padStart(6, "0")}`
        : project.color
      : "#38bdf8";

    // Set accent color CSS variable
    this.modalEl.style.setProperty("--proj-accent", pColor);

    // Populate Headers
    const titleEl = this.modalEl.querySelector("#modal-title");
    const engineTag = this.modalEl.querySelector("#modal-engine-tag");
    const typeTag = this.modalEl.querySelector("#modal-type-tag");

    titleEl.textContent = project.title || "Project";
    engineTag.textContent = project.engine || "DEVELOPMENT";
    typeTag.textContent = project.type || "SHOWCASE";

    // Populate Bullets
    const bulletsList = this.modalEl.querySelector("#modal-bullets-list");
    bulletsList.innerHTML = "";
    if (Array.isArray(project.bullets)) {
      project.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        bulletsList.appendChild(li);
      });
    }

    // Populate Stack Chips
    const stackChips = this.modalEl.querySelector("#modal-stack-chips");
    stackChips.innerHTML = "";
    if (Array.isArray(project.stack)) {
      project.stack.forEach((tech) => {
        const chip = document.createElement("span");
        chip.className = "tech-chip";
        chip.textContent = tech;
        stackChips.appendChild(chip);
      });
    }

    // Populate Action Buttons
    const liveLink = this.modalEl.querySelector("#modal-live-link");
    if (project.link) {
      liveLink.href = project.link;
      liveLink.style.display = "inline-flex";
      liveLink.querySelector("span").textContent = project.link.includes(
        "drive.google.com",
      )
        ? "DOWNLOAD BUILD / GAME DEMO"
        : "LAUNCH PROJECT / LIVE DEMO";
    } else {
      liveLink.style.display = "none";
    }

    // Setup Thumbnails
    const thumbnailsStrip = this.modalEl.querySelector(
      "#modal-thumbnails-strip",
    );
    thumbnailsStrip.innerHTML = "";

    const images =
      Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [
            {
              url: project.thumbnail || "./assets/projects/flappy-1.jpg",
              title: project.title,
              desc: "",
            },
          ];

    images.forEach((imgObj, idx) => {
      const thumbBtn = document.createElement("button");
      thumbBtn.className = `gallery-thumb-btn ${idx === 0 ? "active" : ""}`;
      thumbBtn.setAttribute("aria-label", `View screenshot ${idx + 1}`);
      thumbBtn.innerHTML = `
        <img src="${imgObj.url}" alt="${imgObj.title || `Thumbnail ${idx + 1}`}" loading="lazy" />
        <span class="thumb-index-tag">${idx + 1}</span>
      `;
      thumbBtn.addEventListener("click", () => {
        this.setImageIndex(idx);
      });
      thumbnailsStrip.appendChild(thumbBtn);
    });

    // Render active image
    this.renderActiveImage();

    // Show modal with animation
    this.modalEl.classList.add("active");
    this.modalEl.setAttribute("aria-hidden", "false");
    this.isOpen = true;

    window.addEventListener("keydown", this.handleKeyDown);
  }

  setImageIndex(index) {
    if (!this.currentProject || !this.currentProject.images) return;
    const total = this.currentProject.images.length;
    this.currentImageIndex = ((index % total) + total) % total;
    this.renderActiveImage();
  }

  prevImage() {
    this.setImageIndex(this.currentImageIndex - 1);
  }

  nextImage() {
    this.setImageIndex(this.currentImageIndex + 1);
  }

  renderActiveImage() {
    if (!this.currentProject) return;
    const images = this.currentProject.images || [];
    const current = images[this.currentImageIndex] || {
      url: this.currentProject.thumbnail,
      title: this.currentProject.title,
      desc: "",
    };

    const mainImg = this.modalEl.querySelector("#modal-main-img");
    const counter = this.modalEl.querySelector("#modal-img-counter");
    const titleEl = this.modalEl.querySelector("#modal-img-title");
    const descEl = this.modalEl.querySelector("#modal-img-desc");

    // Smooth transition
    mainImg.style.opacity = "0.3";
    mainImg.style.transform = "scale(0.98)";

    setTimeout(() => {
      mainImg.src = current.url;
      mainImg.alt = current.title || "Project Screenshot";
      mainImg.onload = () => {
        mainImg.style.opacity = "1";
        mainImg.style.transform = "scale(1)";
      };
      mainImg.style.opacity = "1";
      mainImg.style.transform = "scale(1)";
    }, 100);

    counter.textContent = `${String(this.currentImageIndex + 1).padStart(2, "0")} / ${String(
      Math.max(1, images.length),
    ).padStart(2, "0")}`;
    titleEl.textContent =
      current.title || `Screenshot ${this.currentImageIndex + 1}`;
    descEl.textContent = current.desc || "";

    // Update thumbnail active status
    const thumbBtns = this.modalEl.querySelectorAll(".gallery-thumb-btn");
    thumbBtns.forEach((btn, idx) => {
      if (idx === this.currentImageIndex) {
        btn.classList.add("active");
        btn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      } else {
        btn.classList.remove("active");
      }
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    window.removeEventListener("keydown", this.handleKeyDown);

    if (this.modalEl) {
      this.modalEl.classList.remove("active");
      this.modalEl.setAttribute("aria-hidden", "true");
    }

    if (typeof this.onCloseCallback === "function") {
      this.onCloseCallback();
      this.onCloseCallback = null;
    }
  }

  handleKeyDown(e) {
    if (!this.isOpen) return;
    if (e.key === "Escape" || e.code === "Escape") {
      e.stopPropagation();
      this.close();
    } else if (e.key === "ArrowLeft" || e.code === "ArrowLeft") {
      e.stopPropagation();
      this.prevImage();
    } else if (e.key === "ArrowRight" || e.code === "ArrowRight") {
      e.stopPropagation();
      this.nextImage();
    }
  }
}

export const projectModal = new ProjectModal();
