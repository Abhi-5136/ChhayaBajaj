/* ==========================================================================
   CHHAYA BAJAJ - Main JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlider();
  initTestRideModal();
  initVehicleFilter();
  initForms();
});

/* --------------------------------------------------------------------------
   1. Navigation & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Set active state for both top nav and drawer links
  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && href === '/')) {
      link.classList.add('active');
    }
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileBtn && mobileBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
    mobileBtn && mobileBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', openDrawer);
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   2. Hero Slider Controller
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  const sliderContainer = document.querySelector('.hero-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* --------------------------------------------------------------------------
   3. Book Test Ride Modal Popup
   -------------------------------------------------------------------------- */
function initTestRideModal() {
  const modalBackdrop = document.getElementById('testRideModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const vehicleSelect = document.getElementById('modalVehicleSelect');
  const modalForm = document.getElementById('testRideForm');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPath === 'index.html' || currentPath === '' || window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
  const autoPopupKey = 'chhayaBajajTestRideAutoPopupShown';
  const hasShownInSession = window.sessionStorage.getItem(autoPopupKey) === '1';

  if (!modalBackdrop) return;

  function openModal(bikeName = '') {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (vehicleSelect && bikeName) {
      const options = vehicleSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.toLowerCase().includes(bikeName.toLowerCase())) {
          vehicleSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (isHomePage && !hasShownInSession) {
    window.setTimeout(() => {
      if (!modalBackdrop.classList.contains('open')) {
        openModal();
        window.sessionStorage.setItem(autoPopupKey, '1');
        window.localStorage.setItem(autoPopupKey, '1');
      }
    }, 15000);
  }

  // Trigger buttons
  document.querySelectorAll('.btn-test-ride').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.bike-card');
      const bikeTitle = card ? card.querySelector('.bike-card-title')?.innerText : '';
      openModal(bikeTitle);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const riderName = document.getElementById('testRideName')?.value.trim() || 'N/A';
      const riderPhone = document.getElementById('testRidePhone')?.value.trim() || 'N/A';
      const bikeModel = vehicleSelect?.value || vehicleSelect?.selectedOptions?.[0]?.text || 'N/A';
      const preferredDateValue = document.getElementById('testRideDate')?.value;
      const preferredDate = preferredDateValue
        ? new Date(`${preferredDateValue}T00:00:00`).toLocaleDateString('en-IN')
        : 'N/A';

      const message = [
        'Test Ride Form',
        '',
        `Full Name: ${riderName}`,
        `Mobile Number: ${riderPhone}`,
        `Selected Bike Model: ${bikeModel}`,
        `Preferred Date: ${preferredDate}`,
        '',
        'Please confirm the test ride booking.'
      ].join('\n');

      const whatsappUrl = `https://wa.me/919415357605?text=${encodeURIComponent(message)}`;
      closeModal();
      modalForm.reset();

      const openedWindow = window.open(whatsappUrl, '_blank', 'noopener');
      if (!openedWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Vehicles Filter Tabs
   -------------------------------------------------------------------------- */
function initVehicleFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const vehicleCards = document.querySelectorAll('.vehicle-item');

  if (filterBtns.length === 0) return;

  function applyFilter(filter) {
    vehicleCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
        // Small fade-in effect
        card.style.opacity = '0';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.3s ease';
          card.style.opacity = '1';
        });
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // Apply the default active filter on page load
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    applyFilter(activeBtn.getAttribute('data-filter'));
  }
}


/* --------------------------------------------------------------------------
   5. Forms Validation & Toast Feedback
   -------------------------------------------------------------------------- */
function initForms() {
  const serviceForm = document.getElementById('serviceForm');

  if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const ownerName = document.getElementById('serviceOwnerName')?.value.trim() || 'N/A';
      const phoneNumber = document.getElementById('servicePhoneNumber')?.value.trim() || 'N/A';
      const vehicle = document.getElementById('serviceVehicle')?.value.trim() || 'N/A';
      const serviceType = document.getElementById('serviceType')?.value.trim() || 'N/A';
      const serviceDate = document.getElementById('serviceDate')?.value;
      const preferredDate = serviceDate
        ? new Date(`${serviceDate}T00:00:00`).toLocaleDateString('en-IN')
        : 'N/A';

      const message = [
        'Service Appointment Form',
        '',
        `Owner Name: ${ownerName}`,
        `Phone Number: ${phoneNumber}`,
        `Vehicle Registration / Model: ${vehicle}`,
        `Required Service Type: ${serviceType}`,
        `Preferred Service Date: ${preferredDate}`,
        '',
        'Please confirm the booking.'
      ].join('\n');

      const whatsappUrl = `https://wa.me/919415357605?text=${encodeURIComponent(message)}`;
      const openedWindow = window.open(whatsappUrl, '_blank', 'noopener');

      if (!openedWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }

  const careersForm = document.getElementById('careersForm');

  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const applicantName = document.getElementById('careerApplicantName')?.value.trim() || 'N/A';
      const applicantEmail = document.getElementById('careerApplicantEmail')?.value.trim() || 'N/A';
      const applicantPhone = document.getElementById('careerApplicantPhone')?.value.trim() || 'N/A';
      const position = document.getElementById('careerPosition')?.value.trim() || 'N/A';
      const address = document.getElementById('careerApplicantAddress')?.value.trim() || 'N/A';
      const summary = document.getElementById('careerApplicantSummary')?.value.trim() || 'N/A';

      const message = [
        'Application Form',
        '',
        `Applicant Name: ${applicantName}`,
        `Email Address: ${applicantEmail}`,
        `Phone Number: ${applicantPhone}`,
        `Position of Interest: ${position}`,
        `Current Residential Address: ${address}`,
        `Cover Letter / Experience Summary: ${summary}`,
        '',
        'Please review this application.'
      ].join('\n');

      const whatsappUrl = `https://wa.me/919415357605?text=${encodeURIComponent(message)}`;
      const openedWindow = window.open(whatsappUrl, '_blank', 'noopener');

      if (!openedWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('contactFullName')?.value.trim() || 'N/A';
      const email = document.getElementById('contactEmail')?.value.trim() || 'N/A';
      const phone = document.getElementById('contactPhone')?.value.trim() || 'N/A';
      const reason = document.getElementById('contactReason')?.value.trim() || 'N/A';
      const messageText = document.getElementById('contactMessage')?.value.trim() || 'N/A';

      const message = [
        'Contact Form',
        '',
        `Full Name: ${fullName}`,
        `Email Address: ${email}`,
        `Phone Number: ${phone}`,
        `Reason for Inquiry: ${reason}`,
        `Your Message: ${messageText}`,
        '',
        'Please respond to this enquiry.'
      ].join('\n');

      const whatsappUrl = `https://wa.me/919415357605?text=${encodeURIComponent(message)}`;
      const openedWindow = window.open(whatsappUrl, '_blank', 'noopener');

      if (!openedWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }
}

/* Helper Toast Notification */
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea1d24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
