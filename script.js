document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Drawer Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navCloseBtn = document.getElementById('navCloseBtn');

  if (navToggle && navLinks) {
    // Open/Close menu via hamburger click
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close menu via 'X' close button inside the drawer
    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    }

    // Close menu when clicking standard navigation links
    document.querySelectorAll('.nav-links a:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }
});

// Inline YouTube Player Handler
function activatePlayer(wrapper, videoId) {
  wrapper.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1" 
      title="YouTube video player"
      style="width:100%; height:100%; border:0; position:absolute; top:0; left:0;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>`;
}

// Google Drive Audio Lightbox Modal Handlers
function openPlayerModal(driveId, title) {
  const modal = document.getElementById('playerModal');
  const songTitle = document.getElementById('modalSongTitle');
  const iframe = document.getElementById('audioPreviewIframe');

  if (modal && songTitle && iframe) {
    songTitle.textContent = title;
    iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
    modal.classList.add('active');
  }
}

function forceCloseModal() {
  const modal = document.getElementById('playerModal');
  const iframe = document.getElementById('audioPreviewIframe');
  if (modal && iframe) {
    iframe.src = '';
    modal.classList.remove('active');
  }
}

function closePlayerModal(e) {
  if (e.target.id === 'playerModal') {
    forceCloseModal();
  }
}

// Contact Form Data Handlers
function getContactFormData() {
  const name = document.getElementById('clientName')?.value.trim() || 'Not provided';
  const phone = document.getElementById('clientPhone')?.value.trim() || 'Not provided';
  const type = document.getElementById('inquiryType')?.value || 'General Inquiry';
  const city = document.getElementById('eventCity')?.value.trim() || 'Not provided';
  const msg = document.getElementById('clientMsg')?.value.trim() || 'None';
  return { name, phone, type, city, msg };
}

function validateContactForm() {
  const name = document.getElementById('clientName')?.value.trim();
  const phone = document.getElementById('clientPhone')?.value.trim();
  if (!name || !phone) {
    alert('Please fill out your Name and Phone Number.');
    return false;
  }
  return true;
}

function submitContactEmail() {
  if (!validateContactForm()) return;
  const data = getContactFormData();
  const subject = encodeURIComponent("Inquiry for Yashashree Bhave - " + data.type);
  const body = encodeURIComponent(
    "Hello Management Team,\n\n" +
    "I would like to inquire regarding the following:\n\n" +
    "• Name / Organization: " + data.name + "\n" +
    "• Phone: " + data.phone + "\n" +
    "• Inquiry Type: " + data.type + "\n" +
    "• City / Location: " + data.city + "\n" +
    "• Details / Message: " + data.msg + "\n\n" +
    "Please share availability and commercial details at the earliest.\n\n" +
    "Regards,\n" + data.name
  );
  window.location.href = "mailto:sgpathak@gmail.com?subject=" + subject + "&body=" + body;
}

function submitContactWhatsApp() {
  if (!validateContactForm()) return;
  const data = getContactFormData();
  const text = encodeURIComponent(
    "*Inquiry for Yashashree Bhave*\n\n" +
    "• *Name:* " + data.name + "\n" +
    "• *Phone:* " + data.phone + "\n" +
    "• *Nature:* " + data.type + "\n" +
    "• *City:* " + data.city + "\n" +
    "• *Details:* " + data.msg
  );
  window.open("https://wa.me/919823394218?text=" + text, "_blank");
}

// Image Lightbox Handlers
function openImageLightbox(url) {
  const lightbox = document.getElementById('imageLightbox');
  const img = document.getElementById('lightboxImg');
  if (lightbox && img) {
    img.src = url;
    lightbox.classList.add('active');
  }
}

function closeImageLightbox(e) {
  const lightbox = document.getElementById('imageLightbox');
  if (lightbox && (e.target.id === 'imageLightbox' || e.target.classList.contains('image-lightbox-close'))) {
    lightbox.classList.remove('active');
  }
}

// Direct 1-Click File Download
async function triggerFileDownload(imageUrl, fileName, buttonElement) {
  const originalText = buttonElement.innerHTML;
  buttonElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
  buttonElement.style.pointerEvents = 'none';

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.target = '_blank';
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    buttonElement.innerHTML = originalText;
    buttonElement.style.pointerEvents = 'auto';
  }
}

function toggleMobileDropdown(element) {
  if (window.innerWidth <= 920) {
    const parentLi = element.parentElement;
    parentLi.classList.toggle('open');
  }
}


// Check if this visitor has already been counted in this session
  const hasVisited = sessionStorage.getItem('yashashree_visited');
  
  // Choose endpoint: 'up' increments the count, '' just fetches the current count without incrementing on refresh
  const endpoint = hasVisited ? '' : '/up';

  fetch('https://api.counterapi.dev/v1/yashashreebhave/visits' + endpoint)
    .then(response => response.json())
    .then(data => {
      if (data && data.count) {
        document.getElementById('visitorCount').innerText = data.count.toLocaleString();
        // Mark session as counted so refreshing won't trigger another increment
        if (!hasVisited) {
          sessionStorage.setItem('yashashree_visited', 'true');
        }
      } else {
        document.getElementById('visitorCount').innerText = '1';
      }
    })
    .catch(() => {
      document.getElementById('visitorCount').innerText = '1+';
    });