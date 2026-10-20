(function ($) {
    "use strict";

    /* ==========================================================================
       1. FIXED DROPDOWN NAVIGATION (MOBILE & DESKTOP SAFE)
       ========================================================================== */
    $(document).ready(function () {
        // Mobile Click Toggle
        $(document).on('click touchstart', '.navbar .dropdown-toggle', function (e) {
            if ($(window).width() <= 991) {
                e.preventDefault();
                e.stopPropagation();

                var $parent = $(this).closest('.dropdown');
                var $menu = $parent.children('.dropdown-menu');
                var isShown = $parent.hasClass('show') || $menu.is(':visible');

                // Close all other open dropdowns
                $('.navbar .dropdown').removeClass('show');
                $('.navbar .dropdown-menu').removeClass('show').css('display', '');

                // Toggle current dropdown
                if (!isShown) {
                    $parent.addClass('show');
                    $menu.addClass('show').css({
                        'display': 'block',
                        'visibility': 'visible',
                        'opacity': '1'
                    });
                } else {
                    $parent.removeClass('show');
                    $menu.removeClass('show').css('display', 'none');
                }
            }
        });

        // Desktop Hover Toggle
        $('.navbar .dropdown').hover(
            function () {
                if ($(window).width() > 991) {
                    $(this).addClass('show');
                    $(this).children('.dropdown-menu').addClass('show').css('display', 'block');
                }
            },
            function () {
                if ($(window).width() > 991) {
                    $(this).removeClass('show');
                    $(this).children('.dropdown-menu').removeClass('show').css('display', '');
                }
            }
        );
    });

    // Testimonial Sliders (Slick)
    if ($.fn.slick) {
        if ($('.testimonial-slider').length) {
            $('.testimonial-slider').slick({
                infinite: true,
                autoplay: true,
                arrows: false,
                dots: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                asNavFor: '.testimonial-slider-nav'
            });
        }
        if ($('.testimonial-slider-nav').length) {
            $('.testimonial-slider-nav').slick({
                arrows: false,
                dots: false,
                focusOnSelect: true,
                centerMode: true,
                centerPadding: '22px',
                slidesToShow: 3,
                asNavFor: '.testimonial-slider'
            });
        }
    }
    $('.testimonial .slider-nav').css({"position": "relative", "height": "160px"});

    // Owl Carousel (Related Blogs)
    if ($.fn.owlCarousel && $(".related-slider").length) {
        $(".related-slider").owlCarousel({
            autoplay: true,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 2 }
            }
        });
    }

    // Isotope Filtering
    if ($.fn.isotope && $('.portfolio-container').length) {
        var portfolioIsotope = $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $('#portfolio-flters li').on('click', function () {
            $("#portfolio-flters li").removeClass('filter-active');
            $(this).addClass('filter-active');
            portfolioIsotope.isotope({filter: $(this).data('filter')});
        });
    }

})(jQuery);


/* ==========================================================================
   2. FULL SERVICE DETAILS SHOW/HIDE TOGGLE
   ========================================================================== */
function showFullDetails(detailId) {
    const mainView = document.getElementById('services-main-view');
    const detailContainer = document.getElementById('service-detail-container');
    
    if (mainView) mainView.style.display = 'none';

    var allDetails = document.querySelectorAll('.detail-content-item');
    allDetails.forEach(function(item) {
        item.style.display = 'none';
    });

    if (detailContainer) detailContainer.style.display = 'block';
    
    const targetItem = document.getElementById(detailId);
    if (targetItem) targetItem.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideFullDetails() {
    const detailContainer = document.getElementById('service-detail-container');
    const mainView = document.getElementById('services-main-view');

    if (detailContainer) detailContainer.style.display = 'none';
    if (mainView) mainView.style.display = 'block';
}


/* ==========================================================================
   3. PHOTO GALLERY LIGHTBOX SYSTEM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Horizontal Carousel Navigation
    const track = document.getElementById('galleryTrack');
    const cPrev = document.getElementById('carouselPrevBtn');
    const cNext = document.getElementById('carouselNextBtn');

    if (track && cPrev && cNext) {
        cNext.addEventListener('click', () => track.scrollBy({ left: 320, behavior: 'smooth' }));
        cPrev.addEventListener('click', () => track.scrollBy({ left: -320, behavior: 'smooth' }));
    }

    // 2. Lightbox Elements
    const gridModal = document.getElementById('gridModal');
    const gridOverlay = document.getElementById('gridOverlay');
    const gridModalClose = document.getElementById('gridModalClose');
    const photoGrid = document.getElementById('photoGrid');
    const crumbCategory = document.getElementById('crumbCategory');

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let activeImages = [];
    let currentImageIdx = 0;

    // Triggers
    document.querySelectorAll('.view-gallery-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const rawGallery = btn.getAttribute('data-gallery');
            const categoryName = btn.getAttribute('data-category') || 'Gallery';

            if (rawGallery) {
                try {
                    activeImages = JSON.parse(rawGallery);
                    if (crumbCategory) crumbCategory.textContent = categoryName;
                    renderPhotoGrid(activeImages);
                    openGridModal();
                } catch (err) {
                    console.error("Invalid JSON gallery string", err);
                }
            }
        });
    });

    function renderPhotoGrid(images) {
        if (!photoGrid) return;
        photoGrid.innerHTML = '';
        images.forEach((url, idx) => {
            const item = document.createElement('div');
            item.className = 'grid-photo-item';
            item.innerHTML = `<img src="${url}" alt="Gallery Image ${idx + 1}">`;
            item.addEventListener('click', () => {
                currentImageIdx = idx;
                openLightbox();
            });
            photoGrid.appendChild(item);
        });
    }

    function openGridModal() {
        if (gridModal) gridModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGridModal() {
        if (gridModal) gridModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openLightbox() {
        updateLightbox();
        if (lightboxModal) lightboxModal.classList.add('active');
    }

    function closeLightbox() {
        if (lightboxModal) lightboxModal.classList.remove('active');
    }

    function updateLightbox() {
        if (lightboxImage) lightboxImage.src = activeImages[currentImageIdx];
        if (lightboxCounter) lightboxCounter.textContent = `${currentImageIdx + 1} / ${activeImages.length}`;
    }

    function nextImage() {
        if (!activeImages.length) return;
        currentImageIdx = (currentImageIdx + 1) % activeImages.length;
        updateLightbox();
    }

    function prevImage() {
        if (!activeImages.length) return;
        currentImageIdx = (currentImageIdx - 1 + activeImages.length) % activeImages.length;
        updateLightbox();
    }

    if (gridModalClose) gridModalClose.addEventListener('click', closeGridModal);
    if (gridOverlay) gridOverlay.addEventListener('click', closeGridModal);

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        } else if (gridModal && gridModal.classList.contains('active')) {
            if (e.key === 'Escape') closeGridModal();
        }
    });
});


/* ==========================================================================
   4. CONSTRUCTION PROJECTS (DATABASE & MODAL LOGIC)
   ========================================================================== */
window.projectDetails = {
    budhanilkantha: {
        title: "Budhanilkantha Residence 2",
        img: "img/budhanilkantha.jpg",
        client: "Private Residential Owner",
        location: "Budhanilkantha Municipality",
        date: "January 2026",
        landArea: "0-5-0-0",
        landSize: "40' x 43'",
        roadAccess: "East",
        description: "Modern residence with rental 2BHK on ground floor and open living layout on upper floors.",
        amenities: [
            "Ground floor – Rental 2BHK +Car porch",
            "First floor – Open floor Living, Dining, Kitchen, Master Bedroom -1, WC",
            "Second floor – Family Lobby, Master Bedroom -1, Bedroom -1, WC"
        ]
    },
    tokha: {
        title: "Tokha -Bungalow",
        img: "img/portfolio-4.jpg",
        client: "Private Residential Owner",
        location: "Tokha Municipality",
        date: "February 2026",
        landArea: "0-6-2-0",
        landSize: "45' x 50'",
        roadAccess: "North",
        description: "Spacious luxury bungalow featuring private garage, attached bathrooms, and temple area on top floor.",
        amenities: [
            "Ground floor – Spacious Living Area + Garage",
            "First floor – 3 Bedrooms with attached bathroom",
            "Top floor – Terrace & Temple Area"
        ]
    },
    pharping: {
        title: "Pharping Residence",
        img: "img/portfolio-5.jpg",
        client: "Private Residential Owner",
        location: "Dakshinkali Municipality",
        date: "March 2026",
        landArea: "0-4-1-0",
        landSize: "38' x 40'",
        roadAccess: "West",
        description: "Beautiful residential home with open kitchen, private balcony, and lush garden space.",
        amenities: [
            "Ground floor – Parking & Garden Area",
            "First floor – Open Kitchen and Living",
            "Second floor – Master Bedroom with Balcony"
        ]
    },
    balaju: {
        title: "Balaju Modern Villa",
        img: "img/balaju.jpg",
        client: "Private Owner",
        location: "Kathmandu Municipality",
        date: "April 2026",
        landArea: "0-4-0-0",
        landSize: "35’ x 40’",
        roadAccess: "South",
        description: "Modern villa with dedicated garage and scenic garden space.",
        amenities: ["Garage", "Garden"]
    },
    lalitpur: {
        title: "Lalitpur Heights",
        img: "img/lalitpur.jpg",
        client: "Commercial Client",
        location: "Lalitpur Municipality",
        date: "May 2026",
        landArea: "0-8-0-0",
        landSize: "50’ x 60’",
        roadAccess: "Main Road",
        description: "Commercial multi-story building featuring underground parking and lift facilities.",
        amenities: ["Lift Facility", "Underground Parking"]
    },
    kirtipur: {
        title: "Kirtipur Commercial Complex",
        img: "img/kirtipur.jpg",
        client: "Commercial Client",
        location: "Kirtipur Municipality",
        date: "June 2026",
        landArea: "0-8-0-0",
        landSize: "50’ x 60’",
        roadAccess: "Main Road",
        description: "Commercial multi-story building featuring underground parking and lift facilities.",
        amenities: ["Lift Facility", "Underground Parking"]
    }
};

let autoSlideInterval;

function slideProjects(direction) {
    const slider = document.getElementById("projectsSlider");
    if (!slider) return;

    const scrollAmount = slider.clientWidth * 0.8;

    if (direction === "left") {
        if (slider.scrollLeft <= 0) {
            slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
        } else {
            slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    } else {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
            slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        slideProjects('right');
    }, 3000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("projectsSlider");
    if (slider) {
        startAutoSlide();
        slider.addEventListener("mouseenter", stopAutoSlide);
        slider.addEventListener("mouseleave", startAutoSlide);
        slider.addEventListener("touchstart", stopAutoSlide);
        slider.addEventListener("touchend", startAutoSlide);
    }
});

function openSidePanel(projectId) {
    const key = String(projectId).toLowerCase();
    const data = window.projectDetails[key];
    if (!data) return;

    const html = `
        <div class="details-hero" style="background-image: url('${data.img}');">
            <div class="details-hero-content">
                <p class="breadcrumbs">Home &nbsp;/&nbsp; Portfolio &nbsp;/&nbsp; ${data.title}</p>
                <h1>${data.title}</h1>
                <div class="hero-meta-row">
                    <span><i class="fas fa-user"></i> <strong>Client:</strong> ${data.client}</span>
                    <span><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${data.location}</span>
                    <span><i class="fas fa-calendar-alt"></i> <strong>Date:</strong> ${data.date}</span>
                </div>
            </div>
        </div>

        <div class="details-body p-4">
            <div class="details-grid mb-4">
                <div class="details-main-img">
                    <img src="${data.img}" alt="${data.title}" class="img-fluid rounded">
                </div>
                <div>
                    <div class="details-card-info">
                        <h4>Project Details</h4>
                        <table class="details-table">
                            <tr><td>Client</td><td>${data.client}</td></tr>
                            <tr><td>Location</td><td>${data.location}</td></tr>
                            <tr><td>Land Area</td><td>${data.landArea}</td></tr>
                            <tr><td>Land Size</td><td>${data.landSize}</td></tr>
                            <tr><td>Road Access</td><td>${data.roadAccess}</td></tr>
                        </table>

                        <div class="amenities-box mt-3">
                            <h5>Amenities</h5>
                            <ul>
                                ${data.amenities.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="project-description-text border-top pt-4 mt-4">
                ${data.description}
            </div>
        </div>
    `;

    const panelContent = document.getElementById("panelContent");
    const sidePanel = document.getElementById("sidePanel");
    const sideOverlay = document.getElementById("sideOverlay");

    if (panelContent) panelContent.innerHTML = html;
    if (sidePanel) sidePanel.classList.add("active");
    if (sideOverlay) sideOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeSidePanel() {
    const sidePanel = document.getElementById("sidePanel");
    const sideOverlay = document.getElementById("sideOverlay");
    const fullOverlay = document.getElementById("fullPageOverlay") || document.getElementById('allProjectsModal');

    if (sidePanel) sidePanel.classList.remove("active");
    if (sideOverlay) sideOverlay.style.display = "none";

    if (!fullOverlay || fullOverlay.style.display !== "block") {
        document.body.style.overflow = "auto";
    }
}

function openFullPageProjects() {
    const gridContainer = document.getElementById("allProjectsGrid") || document.getElementById("allProjectsGridContainer");
    if (!gridContainer) return;

    const fallbackImg = 'img/placeholder.jpg';
    gridContainer.className = "row g-2 g-md-4 px-1 px-md-3"; 

    let cardsHTML = "";

    Object.keys(window.projectDetails).forEach(key => {
        const item = window.projectDetails[key];
        const titleText = item.title || 'Construction Project';
        const clientText = item.client || 'Private Owner';
        const locationText = item.location || 'Nepal';
        const imgSrc = item.img || fallbackImg;

        const rawDesc = item.description ? item.description.replace(/<[^>]*>?/gm, '') : '';
        const descText = rawDesc.length > 70 ? rawDesc.substring(0, 70) + '...' : rawDesc;
        const safeKey = String(key).replace(/'/g, "\\'");

        cardsHTML += `
            <div class="col-6 col-md-4 mb-3">
                <div class="custom-project-card">
                    <div class="card-img-container">
                        <img src="${imgSrc}" alt="${titleText}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='${fallbackImg}';">
                    </div>
                    <div style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                        <div>
                            <h3 class="card-title-text">${titleText}</h3>
                            <p class="card-desc-text">${descText}</p>
                            <div class="card-meta-text">
                                <i class="fas fa-user" style="color: #0d6efd; flex-shrink: 0; width: 14px;"></i>
                                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${clientText}</span>
                            </div>
                            <div class="card-meta-text" style="margin-bottom: 14px;">
                                <i class="fas fa-map-marker-alt" style="color: #0d6efd; flex-shrink: 0; width: 14px;"></i>
                                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${locationText}</span>
                            </div>
                        </div>
                        <div style="margin-top: auto;">
                            <button type="button" 
                                    onclick="closeFullPageProjects(); openSidePanel('${safeKey}');" 
                                    class="btn-yellow-hover-navy">
                                <span>View Details &rarr;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = cardsHTML;

    const overlay = document.getElementById("fullPageOverlay") || document.getElementById('allProjectsModal');
    if (overlay) overlay.style.display = "block";
    document.body.style.overflow = "hidden";
}

function openAllProjectsGrid() {
    openFullPageProjects();
}

function closeFullPageProjects() {
    const overlay = document.getElementById("fullPageOverlay") || document.getElementById('allProjectsModal');
    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "auto";
}

function closeAllProjectsGrid() {
    closeFullPageProjects();
}


/* ==========================================================================
   5. BLOG & ARTICLES MODULE
   ========================================================================== */
window.blogArticles = {
    blog1: {
        title: "Difference between RCC House and Panel House",
        img: "img/final ruwali construction.png",
        date: "Jan 2026",
        readTime: "4 min read",
        desc: "Compare the durability, construction speed, and cost between RCC and Panel structures.",
        content: `
            <img src="img/final ruwali construction.png" class="article-header-img img-fluid rounded mb-3" alt="RCC vs Panel House">
            <p class="article-paragraph">
                When starting a new house, choosing the right <span class="highlight-orange">construction process</span> method is crucial. Factors like cost, durability, and time play a major role in deciding between Reinforced Cement Concrete (RCC) and Prefabricated Panel structures.
            </p>
            <h3 class="article-heading-title">What is RCC Construction?</h3>
            <p class="article-paragraph">
                RCC relies on traditional cement, steel rebar, and concrete aggregate frameworks. It provides exceptional earthquake resilience and permanence, making it the primary choice for residential homes in Nepal.
            </p>
            <h3 class="article-heading-title">What is Panel House Construction?</h3>
            <p class="article-paragraph">
                Panel houses utilize prefabricated EPS or lightweight concrete panels. They offer rapid assembly and superior thermal insulation, suitable for rapid builds or secondary structures.
            </p>
        `
    },
   blog2: {
    title: "नेपालमा घर निर्माण गर्न नक्सापास किन आवश्यक छ? (सम्पूर्ण प्रक्रिया र जानकारी)",
    img: "img/enjoyable-home.jpg",
    date: "Feb 2026",
    readTime: "6 min read",
    desc: "नेपालमा घर बनाउँदा नक्सापासको महत्त्व, आवश्यक कागजात, चरणबद्ध प्रक्रिया, लाग्ने शुल्क र ध्यान दिनुपर्ने गल्तीहरूबारे विस्तृत जानकारी।",
    content: `
        <div class="blog-article-container">
            <img src="img/enjoyable-home.jpg" class="article-header-img img-fluid rounded mb-4" alt="House Construction Map Approval Nepal">
            
            <p class="lead fw-normal text-secondary mb-4">
                नेपालमा कुनै पनि भवन निर्माण सुरु गर्नुअघि स्थानीय निकाय (नगरपालिका वा गाउँपालिका) बाट आधिकारिक <strong>नक्सा स्वीकृति (नक्सापास)</strong> लिनु अनिवार्य कानुनी र प्राविधिक प्रक्रिया हो।
            </p>

            <div class="alert alert-warning border-0 shadow-sm rounded-3 p-3 mb-4">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>ध्यान दिनुहोस्:</strong> नक्सापास नगरी भवन निर्माण गरेमा ठूलो जरिवाना, कानुनी कारबाही, विद्युत् तथा खानेपानीजस्ता सेवा बन्द हुने र निर्माण गरिएको भवन भत्काउने आदेशसम्म आउन सक्छ।
            </div>

            <h3 class="mt-4 mb-3 fw-bold text-dark">नक्सापास भनेको के हो?</h3>
            <p>
                <strong>नक्सापास</strong> भनेको स्थानीय निकायबाट प्रदान गरिने औपचारिक स्वीकृति हो, जसले तपाईंलाई आफ्नो जग्गामा कानुनी रूपमा भवन निर्माण सुरु गर्न अनुमति दिन्छ।
            </p>
            <ul>
                <li><strong>नक्सा:</strong> भवनको वास्तुकला (Architectural Layout), इन्जिनियरिङ र संरचनात्मक (Structural) ब्लुप्रिन्ट।</li>
                <li><strong>पास:</strong> उक्त डिजाइन सरकारी निकाय, राष्ट्रिय भवन संहिता (National Building Code) र स्थानीय मापदण्ड अनुरूप स्वीकृत हुनु।</li>
            </ul>

            <hr class="my-4">

            <h3 class="mb-3 fw-bold text-dark">नेपालमा नक्सापास किन आवश्यक छ?</h3>
            <div class="row g-3 my-2">
                <div class="col-md-6">
                    <div class="p-3 border rounded-3 bg-light h-100">
                        <h5 class="fw-bold text-primary">१. कानुनी मापदण्ड र सुरक्षा</h5>
                        <p class="mb-0 fs-6">स्थानीय निकायको नियम पालना गराई भूकम्प प्रतिरोधी र संरचनात्मक रूपमा सुरक्षित घर निर्माण सुनिश्चित गर्छ।</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 border rounded-3 bg-light h-100">
                        <h5 class="fw-bold text-primary">२. सरकारी सुविधा र बैंकिङ</h5>
                        <p class="mb-0 fs-6">विद्युत्, खानेपानी, इन्टरनेट जोड्न तथा बैंकबाट घर कर्जा (Home Loan) वा धितो मूल्याङ्कनका लागि अनिवार्य हुन्छ।</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 border rounded-3 bg-light h-100">
                        <h5 class="fw-bold text-primary">३. भू–उपयोग र छिमेकी सुरक्षा</h5>
                        <p class="mb-0 fs-6">आवासीय तथा व्यावसायिक क्षेत्रको मापदण्ड मिलाउन र भविष्यमा छिमेकीसँग हुन सक्ने सिमाना वा घाम/बाटोको विवाद रोक्न।</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 border rounded-3 bg-light h-100">
                        <h5 class="fw-bold text-primary">४. सम्पत्ति मूल्याङ्कन</h5>
                        <p class="mb-0 fs-6">कर दर्ता, हक हस्तान्तरण, खरिद-बिक्री तथा कानुनी झन्झटबाट मुक्त रहन मद्दत पुग्छ।</p>
                    </div>
                </div>
            </div>

            <hr class="my-4">

            <h3 class="mb-3 fw-bold text-dark">नक्सापासका लागि आवश्यक कागजातहरू</h3>
            <ul class="list-group list-group-flush mb-4">
                <li class="list-group-item">✔️ <strong>जग्गाधनी प्रमाणपुर्जा (लालपुर्जा):</strong> स्वामित्व प्रमाणित गर्न।</li>
                <li class="list-group-item">✔️ <strong>नागरिकताको प्रमाणपत्र:</strong> आवेदकको पहिचानका लागि।</li>
                <li class="list-group-item">✔️ <strong>ब्लुप्रिन्ट तथा वास्तुकला डिजाइन:</strong> इन्जिनियर वा आर्किटेक्टद्वारा तयार पारिएको नक्सा।</li>
                <li class="list-group-item">✔️ <strong>जग्गा कर चुक्ता प्रमाणपत्र:</strong> सम्बन्धित वडा/नगरपालिकाको कर चुक्ता।</li>
                <li class="list-group-item">✔️ <strong>इन्जिनियरको स्वीकृति:</strong> नेपाल इन्जिनियरिङ काउन्सिलमा दर्ता भएको इन्जिनियरको छाप र हस्ताक्षर।</li>
                <li class="list-group-item">✔️ <strong>अन्य कागजात:</strong> आवश्यकतानुसार वातावरणीय स्वीकृति, छिमेकीको सहमति वा नोटरी प्रमाणित कागजात।</li>
            </ul>

            <hr class="my-4">

            <h3 class="mb-3 fw-bold text-dark">नक्सापास गर्ने चरणबद्ध प्रक्रिया (Step-by-Step)</h3>
            <ol class="list-group list-group-numbered mb-4">
                <li class="list-group-item"><strong>प्रमाणित इन्जिनियर/आर्किटेक्ट नियुक्त गर्ने:</strong> NEC दर्ता प्राप्त प्राविधिक छनोट गर्ने।</li>
                <li class="list-group-item"><strong>डिजाइन तथा ब्लुप्रिन्ट तयार गर्ने:</strong> Elevation, Floor Plan, Foundation, Fire Escape आदि NBC मापदण्ड अनुसार तयार पार्ने।</li>
                <li class="list-group-item"><strong>कागजात संकलन तथा रुजु:</strong> सम्पूर्ण कानुनी र प्राविधिक कागजात तयार पार्ने।</li>
                <li class="list-group-item"><strong>आवेदन बुझाउने (EBPS):</strong> काठमाडौं, ललितपुर, पोखराजस्ता शहरहरूमा Electronic Building Permit System (EBPS) मार्फत डिजिटल आवेदन दिने।</li>
                <li class="list-group-item"><strong>सूचना तथा स्थलगत प्रमाणीकरण:</strong> वडा कार्यालयबाट १५ दिने सार्वजनिक सूचना जारी गरी छिमेकी वा सर्वसाधारणको दाबी विरोध बुझ्ने।</li>
                <li class="list-group-item"><strong>नगरपालिका इन्जिनियरद्वारा साइट निरीक्षण:</strong> बाटो, चारकिल्ला, Setback र जमिनको अवस्था निरीक्षण गर्ने।</li>
                <li class="list-group-item"><strong>शुल्क भुक्तानी र स्वीकृति:</strong> प्रति वर्गफुट तोकिएको शुल्क (सामान्यतया आवासीयका लागि रु. १०–२५ र व्यावसायिकका लागि रु. ४५ सम्म) तिरी प्रमाणपत्र लिने।</li>
            </ol>

            <div class="bg-light p-4 rounded-3 mb-4">
                <h4 class="fw-bold mb-3">नक्सापासपछि पाइने प्रमाणपत्रहरू:</h4>
                <p class="mb-2"><strong>१. अस्थायी इजाजत (Substructure):</strong> प्लिन्थ लेभल (जग/ग्राउन्ड फ्लोर) सम्म निर्माण गर्न।</p>
                <p class="mb-2"><strong>२. स्थायी इजाजत (Superstructure):</strong> प्लिन्थ जाँचपछि पर्खाल, पिलर, ढलान गर्न दिइने अनुमति।</p>
                <p class="mb-0"><strong>३. निर्माण सम्पन्न प्रमाणपत्र (Completion Certificate):</strong> निर्माण सकिएपछि अन्तिम निरीक्षण गरी दिइने आधिकारिक प्रमाणपत्र।</p>
            </div>

            <hr class="my-4">

            <h3 class="mb-3 fw-bold text-dark">नक्सापास गर्दा बच्नुपर्ने गल्तीहरू</h3>
            <div class="row text-center g-3 mb-4">
                <div class="col-md-4">
                    <div class="p-3 border rounded shadow-sm h-100">
                        <span class="fs-1 text-danger">⚠️</span>
                        <h6 class="fw-bold mt-2">अपूर्ण कागजात</h6>
                        <p class="small text-muted mb-0">कागजात नपुग्दा आवेदन रोकिन वा रद्द हुन सक्छ।</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded shadow-sm h-100">
                        <span class="fs-1 text-danger">🚫</span>
                        <h6 class="fw-bold mt-2">दर्ता नभएको इन्जिनियर</h6>
                        <p class="small text-muted mb-0">अनधिकृत व्यक्तिबाट नक्सा बनाउँदा अमान्य हुन्छ।</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded shadow-sm h-100">
                        <span class="fs-1 text-danger">📐</span>
                        <h6 class="fw-bold mt-2">Setback र नियमावली बेवास्ता</h6>
                        <p class="small text-muted mb-0">मापदण्ड मिचेर बनाइएको घर पास हुँदैन।</p>
                    </div>
                </div>
            </div>

            <hr class="my-4">

            
    `
},
    blog3: {
        title: "RCC House Construction in Nepal",
        img: "img/rcc-nepal.jpg",
        date: "Mar 2026",
        readTime: "5 min read",
        desc: "Essential guidelines for earthquake-resistant building design in Nepal.",
        content: `
            <img src="img/rcc-nepal.jpg" class="article-header-img img-fluid rounded mb-3" alt="RCC House Construction">
            <p class="article-paragraph">
                RCC house construction has remained the preferred choice in Nepal to build a home that stands resilient against seismic events and environmental factors.
            </p>
        `
    },
    blog4: {
        title: "How to Build a House in Nepal? Step-by-Step Guide",
        img: "img/build-house-guide.jpg",
        date: "Apr 2026",
        readTime: "7 min read",
        desc: "A comprehensive step-by-step guide to land acquisition, design, and permits in Nepal.",
        content: `
            <img src="img/build-house-guide.jpg" class="article-header-img img-fluid rounded mb-3" alt="Building House in Nepal">
            <p class="article-paragraph">
                Building a house itself is a dream for any individual and requires significant investments...
            </p>
        `
    }
};

window.blogDatabase = window.blogArticles;

function slideBlogCards(direction) {
    const container = document.getElementById("blogsSlider");
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
}

function loadBlogSection() {
    const slider = document.getElementById('blogsSlider');
    if (!slider) return;

    slider.innerHTML = '';

    Object.keys(window.blogArticles).forEach(id => {
        const item = window.blogArticles[id];
        slider.innerHTML += `
            <div class="blog-card-item flex-shrink-0 mr-3">
                <div class="card h-100 border-0 rounded-lg shadow-sm bg-white overflow-hidden blog-custom-card" style="width: 300px;">
                    <div class="blog-card-img position-relative overflow-hidden" style="height:180px;">
                        <span class="blog-badge position-absolute badge badge-primary m-2">${item.date}</span>
                        <img src="${item.img}" class="img-fluid w-100 h-100" style="object-fit:cover;" alt="${item.title}">
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <div class="blog-meta-tags small text-muted mb-2">
                                <span>Construction</span> • <span>${item.readTime || '5 min read'}</span>
                            </div>
                            <h3 class="blog-card-title h6 font-weight-bold text-dark mb-2">${item.title}</h3>
                            <p class="blog-card-desc text-muted small mb-0">${item.desc}</p>
                        </div>
                        <div class="pt-3">
                            <button type="button" class="btn-pill-custom" onclick="openArticleModal('${id}')">
                                <span>Read More</span>
                                <span class="btn-arrow">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function openArticleModal(blogKey) {
    const blog = window.blogArticles[blogKey];
    const body = document.getElementById("articleBodyContent");
    const panel = document.getElementById("articleSidePanel");
    const overlay = document.getElementById("articleOverlay");

    if (blog && body && panel && overlay) {
        body.innerHTML = blog.content;
        panel.classList.add("open");
        overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeArticleModal() {
    const panel = document.getElementById("articleSidePanel");
    const overlay = document.getElementById("articleOverlay");

    if (panel) panel.classList.remove("open");
    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "auto";
}

function openAllArticlesGrid() {
    const gridContainer = document.getElementById('allBlogsGridContainer');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    Object.keys(window.blogArticles).forEach(key => {
        const item = window.blogArticles[key];
        gridContainer.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 border-0 rounded-lg shadow-sm bg-white overflow-hidden blog-custom-card">
                    <div class="blog-card-img position-relative overflow-hidden">
                        <span class="blog-badge position-absolute badge badge-primary m-2">${item.date}</span>
                        <img src="${item.img}" class="img-fluid w-100" style="height: 200px; object-fit: cover;" alt="${item.title}">
                    </div>
                    <div class="card-body p-3 p-md-4 d-flex flex-column justify-content-between">
                        <div>
                            <div class="blog-meta-tags small text-muted mb-2">
                                <span>Construction</span> • <span>${item.readTime || '5 min read'}</span>
                            </div>
                            <h3 class="blog-card-title h6 font-weight-bold text-dark mb-2">${item.title}</h3>
                            <p class="blog-card-desc text-muted small mb-0">${item.desc}</p>
                        </div>
                        <div class="pt-3">
                            <button type="button" class="btn-pill-custom" onclick="closeAllArticlesGrid(); openArticleModal('${key}');">
                                <span>Read More</span>
                                <span class="btn-arrow">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    const modal = document.getElementById('allBlogsModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeAllArticlesGrid() {
    const modal = document.getElementById("allBlogsModal");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "auto";
}


/* ==========================================================================
   6. NEPALI LAND MEASUREMENT CONVERTER ENGINE
   ========================================================================== */
(function () {
    const CONVERSION_RATES = Object.freeze({
        ropani: 5476,
        aana: 342.25,
        paisa: 85.5625,
        daam: 21.390625,
        bigha: 72900,
        kattha: 3645,
        dhur: 182.25,
        sqft: 1,
        sqm: 10.76391041671,
        acre: 43560,
        hectare: 107639.104
    });

    const MAX_DECIMAL_PLACES = 6;
    let isCalculating = false;

    document.addEventListener('DOMContentLoaded', () => {
        const inputs = Array.from(document.querySelectorAll('input[data-unit]'));
        if (!inputs.length) return;

        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        const clearBtn = document.getElementById('clear-btn');
        const copyBtn = document.getElementById('copy-btn');
        const toastElement = document.getElementById('toast');

        const inputMap = new Map();
        inputs.forEach(input => inputMap.set(input.dataset.unit, input));

        function calculateAndPropagate(sourceUnit, rawValue) {
            if (isCalculating) return;

            if (rawValue === '' || rawValue === null || rawValue === undefined) {
                clearAllFields(sourceUnit);
                return;
            }

            const value = parseFloat(rawValue);

            if (isNaN(value) || value < 0) {
                clearAllFields(sourceUnit);
                return;
            }

            isCalculating = true;

            try {
                const canonicalSqFt = value * CONVERSION_RATES[sourceUnit];

                inputMap.forEach((inputEl, unitKey) => {
                    if (unitKey !== sourceUnit) {
                        const convertedValue = canonicalSqFt / CONVERSION_RATES[unitKey];
                        inputEl.value = formatNumber(convertedValue);
                    }
                });
            } finally {
                isCalculating = false;
            }
        }

        function formatNumber(num) {
            if (!isFinite(num)) return '';
            if (num === 0) return '0';
            const formatted = Number(Math.round(parseFloat(num + 'e' + MAX_DECIMAL_PLACES)) + 'e-' + MAX_DECIMAL_PLACES);
            return formatted.toString();
        }

        function clearAllFields(preserveUnit = null) {
            inputMap.forEach((inputEl, unitKey) => {
                if (unitKey !== preserveUnit) {
                    inputEl.value = '';
                }
            });
        }

        inputs.forEach(input => {
            const unitType = input.dataset.unit;

            const handleRealtimeInput = (e) => {
                const rawVal = e.target.value;
                inputs.forEach(el => el.classList.remove('active-input'));
                e.target.classList.add('active-input');
                calculateAndPropagate(unitType, rawVal);
            };

            input.addEventListener('input', handleRealtimeInput);
            input.addEventListener('keyup', handleRealtimeInput);
            input.addEventListener('keydown', (e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearAllFields();
                inputs.forEach(el => el.classList.remove('active-input'));
                showToast('All fields cleared');
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const sqftVal = inputMap.get('sqft')?.value;
                if (!sqftVal) {
                    showToast('Enter a value first to copy results');
                    return;
                }

                let summaryText = '=== Nepali Land Measurement Results ===\n';
                inputMap.forEach((input, unit) => {
                    if (input.value !== '') {
                        summaryText += `${unit.toUpperCase()}: ${input.value}\n`;
                    }
                });

                navigator.clipboard.writeText(summaryText)
                    .then(() => showToast('Results copied to clipboard!'))
                    .catch(() => showToast('Failed to copy. Check permissions.'));
            });
        }

        function initTheme() {
            const savedTheme = localStorage.getItem('nlc_theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('nlc_theme', newTheme);
                showToast(`Switched to ${newTheme} mode`);
            });
        }

        let toastTimeout;
        function showToast(message) {
            if (!toastElement) return;
            toastElement.textContent = message;
            toastElement.classList.add('visible');
            
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastElement.classList.remove('visible');
            }, 2500);
        }

        initTheme();
    });
})();


/* ==========================================================================
   7. APP GALLERY CARDS & LIGHTBOX MODAL
   ========================================================================== */
const categoryDatabase = [
    {
        id: 'floor-plan',
        title: 'Floor Plan',
        coverImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200'
        ]
    },
    {
        id: 'exterior',
        title: 'Exterior Design',
        coverImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'
        ]
    },
    {
        id: 'interior',
        title: 'Interior Design',
        coverImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
        images: [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200'
        ]
    },
    {
        id: 'renovation',
        title: 'Renovation',
        coverImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
        images: [
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200',
            'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200'
        ]
    }
];

function openAllCardsModal() {
    const modal = document.getElementById('appGalModal');
    const cardsContainer = document.getElementById('modalCardsContainer');
    const imageGrid = document.getElementById('modalImageGrid');
    const bcSubCategory = document.getElementById('bcSubCategory');

    if (!modal || !cardsContainer || !imageGrid) return;

    cardsContainer.style.display = 'grid';
    imageGrid.style.display = 'none';
    if (bcSubCategory) bcSubCategory.innerText = '';

    cardsContainer.innerHTML = categoryDatabase.map(cat => `
        <div class="app-gal-card">
            <div class="app-gal-card-img-wrap">
                <img src="${cat.coverImg}" alt="${cat.title}">
                <div class="app-gal-card-overlay">
                    <h3>${cat.title}</h3>
                    <button class="app-gal-view-link" onclick="openCategoryImages('${cat.id}')">View Gallery &rarr;</button>
                </div>
            </div>
        </div>
    `).join('');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openCategoryImages(categoryId) {
    const modal = document.getElementById('appGalModal');
    const cardsContainer = document.getElementById('modalCardsContainer');
    const imageGrid = document.getElementById('modalImageGrid');
    const bcSubCategory = document.getElementById('bcSubCategory');

    const category = categoryDatabase.find(c => c.id === categoryId);
    if (!category || !modal || !cardsContainer || !imageGrid) return;

    cardsContainer.style.display = 'none';
    imageGrid.style.display = 'grid';
    if (bcSubCategory) bcSubCategory.innerText = ' / ' + category.title;

    imageGrid.innerHTML = category.images.map(imgUrl => `
        <img src="${imgUrl}" onclick="openBigScreen('${imgUrl}')" alt="Gallery Item">
    `).join('');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.getElementById('appGalModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openBigScreen(imgSrc) {
    const lightbox = document.getElementById('appGalLightbox');
    const lightboxImg = document.getElementById('appGalLightboxImg');
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'flex';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('appGalLightbox');
    if (lightbox) lightbox.style.display = 'none';
}


/* ==========================================================================
   8. SERVICES SLIDER & MODAL INTERACTION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const serviceData = {
        'service-1': `
    <div class="detail-modal-body">
        <h2>Construction (RCC & Steel Structure)</h2>
        
        <div class="detail-banner-wrap">
            <img src="img/mero ghar.jpg" alt="RCC and Steel Structure Construction">
        </div>

        <p class="lead-text">
            <strong>Ruwali Construction Pvt. Ltd.</strong> provides high-quality, professional RCC and steel structure construction services across Nepal for homes, commercial buildings, offices, hotels, and infrastructure projects.
        </p>

        <p>
            We take architectural and engineering plans and transform them into strong, safe, and long-lasting buildings. Through accurate planning, expert site supervision, skilled workmanship, and effective project management, we ensure every project turns out successfully.
        </p>

        <h3>Why Quality Construction Matters</h3>
        <p>
            The strength and durability of any building depend directly on the quality of materials, precise concrete mixing, and expert site supervision. Choosing the right construction partner prevents costly delays, extra expenses, and structural weaknesses. At Ruwali Construction, we work closely with clients, architects, and engineers to execute every phase strictly according to safety standards and structural blueprints.
        </p>

        <hr>

        <h3>Our Key Construction Priorities</h3>
        <p>When building your dream project, we focus strictly on:</p>
        <ul class="modal-feature-list">
            <li><strong>High-Grade Materials:</strong> Sourcing and using tested, premium-quality construction materials.</li>
            <li><strong>Precision Concrete Works:</strong> Correct mixing, placement, and proper curing processes.</li>
            <li><strong>Expert Supervision:</strong> Dedicated engineers and experienced supervisors on-site.</li>
            <li><strong>Blueprint Compliance:</strong> Building strictly according to structural and architectural designs.</li>
            <li><strong>Cost & Time Management:</strong> Finishing projects on schedule while optimizing client budgets.</li>
            <li><strong>Safety & Durability:</strong> Uncompromising focus on structural safety to resist seismic activity.</li>
        </ul>

        <h3>Types of Services We Provide</h3>
        <div class="service-type-grid">
            <div class="service-type-box">
                <h4>1. RCC Construction Services</h4>
                <p>Reinforced Cement Concrete (RCC) is the most trusted choice for residential and commercial spaces in Nepal. We handle everything under strict engineering supervision—from deep foundations, columns, beams, and slab castings to complete structural finishing.</p>
            </div>
            <div class="service-type-box">
                <h4>2. Steel Structure Construction</h4>
                <p>Ideal for projects requiring fast execution, flexibility, and high strength—such as commercial complexes, warehouses, hotels, and office spaces. We handle steel component fabrication, precise installation, quality checks, and safety assurance.</p>
            </div>
        </div>

        <h3>Why Choose Ruwali Construction?</h3>
        <ul class="check-list">
            <li> Experienced team of construction professionals and structural experts</li>
            <li> End-to-end support for both RCC and steel fabrication projects</li>
            <li> On-site problem solving and smooth labor coordination</li>
            <li>Transparent communication and strict quality control from start to finish</li>
        </ul>

        <div class="modal-cta-box">
            <h4>Build Your Vision with Confidence</h4>
            <p>A building is a long-term investment. Let us help you build a safer, more dependable, and long-lasting structure.</p>
        </div>
    </div>
`,
 'service-2': `
        <div class="detail-modal-body">
            <h2>House & Space Renovation</h2>
            <div class="detail-banner-wrap">
                <img src="img/final renovation.png" alt="House Renovation">
            </div>
            <p><strong>Ruwali Construction Pvt. Ltd.</strong>  we offer our customers house and space renovation services that enhance the look, comfort, and efficiency of your place. No matter which space you want to renovate, be it a room, apartment, traditional house, or even commercial premises, we are ready to offer professional services and practical solutions for all your needs.</p>
            <p>We plan and develop every renovation project properly in order to provide quality, safety, and long life expectancy of your renovation</p>
            <p>Photo (A high-quality image of a home interior renovation, such as a renovated living room or kitchen with workers or finishing details.)<p/>
            <h3>What We Renovate</h3>
             <ul class="modal-feature-list">
            <li><strong>Living rooms and family spaces</strong></li>
            <li><strong>Kitchens and dining areas</strong></li>
            <li><strong>Bathrooms and utility areas</strong></li>
            <li><strong>Offices and commercial spaces</strong></li>
            <li><strong>Exterior walls, roofing and facades</strong></li>
            </ul>
            <p>Photo (A collage showing a kitchen renovation, bathroom renovation, bedroom renovation and office renovation.)</p>
        </div>
        <div class="detail-banner-wrap">
                <img src="img/final renovation.png" alt="House Renovation">
            </div>
            <h3>Our Renovation Process</h3>
             <ul class="modal-feature-list">
            <li><strong>Site inspection and consultation</strong></li>
            <li><strong>Design and renovation planning</strong></li>
            <li><strong>Material selection and procurement</strong></li>
            <li><strong>Skilled labor and construction work</strong></li>
            <li><strong>finishing and quality inspection</strong></li>
            </ul>
            <p><strong>Ruwali Construction Pvt. Ltd.</strong>The structured way of working allows us to prevent delays and increase cost-effectiveness of the process while maintaining high standards of construction.</p>
            <p>Photo (Workers measuring a room reviewing renovation plans or installing finishes.)</p>
            <h3>Renovation for Your Space</h3>
            <p>No matter whether you need to renovate a family house, office, or investment property, at Ruwali Construction we will do everything possible to provide you with a successful outcome. Please contact us to discuss your renovation project and get a professional consultation and quote.</p>
            <p>Photo (A satisfied homeowner or customer inside of the modern house after renovation.)</p>
    `,
      'service-3': `
        <div class="detail-modal-body">
            <h2> Exterior and Interior Design Services in Nepal</h2>
            <div class="detail-banner-wrap">
                <img src="img/service-3.jpg" alt="Exterior / Interior Designs">
                   </div>
                <p>Designing a home, commercial building, hotel, or office involves more than just making it look good. It needs careful planning, practicality, and a design that can be efficiently constructed. <strong>Ruwali Construction</strong> offers professional exterior and interior design services throughout Nepal. We assist clients in turning their ideas into practical, visually appealing, and construction-ready spaces.</p>
                <p>Whether you’re planning a new home, a commercial complex, a hospitality project, or a renovation, our team works closely with you. We aim to understand your goals, lifestyle, budget, and future needs. From the initial consultation and site assessment to detailed drawings and permit assistance, we guide you through every stage of the design process with clear communication and dependable project coordination.</p>
                 <h3>Comprehensive Exterior and Interior Design Solutions</h3>
                 <p>An effective design combines aesthetics, comfort, safety, and long-lasting durability. At <strong>Ruwali Construction & Suppliers Pvt.Ltd.</strong>, we create building designs that are visually attractive, user-friendly, and suitable for real-world construction.</p>
                  <p>Our design services include 2D floor planning, 3D exterior visualization, façade design, architectural drawings, structural planning, electrical layouts, plumbing layouts, project cost estimation, and documentation support for approvals.</p>
                   <p>We provide design solutions for:</p>
                   <ul class="modal-feature-list">
                   <li><strong>Residential homes and villas</strong></li>
                   <li><strong>Commercial buildings and complexes</strong></li>
                   <li><strong>Hotels and hospitality projects</strong></li>
                   <li><strong> Office interiors and workspaces</strong></li>
                   <li><strong> Renovation and remodeling projects</strong></li>
                   <li><strong>New construction developments</strong></li>
                   <li><strong>Modern exterior elevation and façade design</strong></li>
                     </ul>
                     <h3>Our Design Process</h3>
                     <p>Site Inspection and Measurement</p>
                     <p>We start by visiting the project site to assess the conditions, land dimensions, access roads, orientation, and surrounding environment. Accurate measurements help us develop a design that fits the property and meets construction needs.</p>
                     <h3>Understanding Your Requirements</h3>
                     <p>Our architects and designers talk with you about your preferred style, space needs, family or business requirements, budget, and future plans. This helps us create a design concept that reflects your vision while being practical and cost-effective.</p>
                     <h3>2D Floor Planning</h3>
                     <p>We prepare a detailed 2D floor plan to define room layouts, circulation, entry points, and functional zoning. This stage gives a clear understanding of how the building will be organized before moving to detailed design.</p>
                     <h3>3D Visualization and Exterior Design</h3>
                     <p>We create realistic 3D exterior models and façade concepts. You can visualize how your building will look before construction starts. This includes architectural style, materials, finishes, openings, and overall exterior character.</p>
                     <h3> Architectural Drawings and Documentation</h3>
                     <p>Our team prepares comprehensive architectural drawings required for planning, coordination, and construction. These drawings ensure accuracy, clarity, and smooth implementation during the building process.</p>
                     <h3>Structural Design and Analysis</h3>
                     <p>We provide structural planning and engineering drawings that ensure the building's strength, stability, and safety. Proper structural design helps guarantee durability and compliance with building standards.</p>
                     <h3>Electrical and Plumbing Layouts</h3>
                     <p>We create electrical and sanitary drawings for lighting, wiring, plumbing, drainage, and utility systems. Careful planning at this stage minimizes construction errors and enhances overall functionality.</p>
                     <h3>Cost Estimation and Budgeting</h3>
                     <p>We prepare detailed budgets and estimation reports. This lets you understand the expected construction costs before starting work. Better financial planning helps avoid unnecessary expenses during the project.</p>
                     <h3>Documentation and Approval Support</h3>
                    <p><strong>Ruwali Construction & suppliers Pvt. Ltd.</strong>assists with project documentation and municipal approval procedures, including Naksa Pass permit support when needed. Our team simplifies the approval process to keep your project on track.</p>
                    <h3>Why Choose Ruwali Construction for Design Services?</h3>
                    <p>Choosing the right design partner is critical for the success of any construction project. Ruwali Construction brings together architectural expertise, engineering knowledge, and hands-on construction experience to deliver designs that are not only visually appealing but also practical, buildable, and value-driven.</p>
                    <p>When you partner with us for your exterior and interior design services in Nepal, you benefit from:</p>
                    <p><strong>Experienced Professionals:</strong> A dedicated team of architects, engineers, and construction specialists.</p>
                    <p><strong> Comprehensive Designs:</strong> Detailed 2D floor plans, realistic 3D elevation designs, architectural, structural, electrical, and plumbing drawings.</p>
                    <p><strong> Budget-Conscious Solutions:</strong> Accurate cost estimations and effective budgeting strategies.</p>
                    <p><strong>Streamlined Approvals:</strong> Assistance with project documentation and permit processes.</p>
                    <p><strong>Practical & Usable Spaces:</strong> Designs focused on functionality, user experience, safety, and durability.</p>
                    <p><strong> Coordinated Support:</strong> A seamless journey from conceptualization to construction planning.</p>
                   <h3>Create a Space That Truly Reflects Your Vision</h3>
                   <p>Every structure is a reflection of the aspirations of its occupants and the purpose it serves. Our design philosophy is centered around understanding your unique needs and preferences, and then translating them into a building design that strikes the perfect balance between creativity, functionality, and cost-effectiveness.</p>
                   <p>Whether it’s a dream home, a bustling commercial complex, a welcoming hotel, a productive office space, or a creative renovation, Ruwali Construction is your trusted partner in designing spaces that inspire, impress, and stand the test of time.</p>
                   <strong>Start Your Design Project Today!</strong>
                   <p>If you’re planning a new construction project or a renovation in Nepal and need expert exterior and interior design services, look no further. <strong>Ruwali Construction & Suppliers Pvt. Ltd.</strong> is ready to help you transform your vision into reality with professional, reliable, and aesthetically pleasing designs.</p>
                   <p>With our commitment to quality, meticulous planning, and clear communication, we ensure your design project is a success, resulting in a space you'll love for years to come.</p>
                   <p>Contact <strong>Ruwali Construction</strong> today to schedule a consultation and begin the journey of creating your ideal space.</p>
           
        `,
     'service-4': `
<div class="detail-modal-body">

    <h2>Professional Plumbing Service</h2>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-1.jpg" alt="Professional Plumbing Service">
    </div>

    <p>
        <strong>Ruwali Construction & Suppliers Pvt. Ltd.</strong> provides complete plumbing services for all kind of residential,
        commercial, industrial and hospitality construction throughout Nepal with highly quality &
        well experienced plumbing works. Complete plumbing work that include water supply system,
        drainage system, sanitary installation, pipe fitting, water tank installation, pump systems,
        and maintenance services will be provided with an efficient, safe and lasting water network systems.
    </p>

    <p>
        The perfect plumbing system is always one of the important basics for every building. Being under
        the process of construct any home, apartment, apartment, hostel, office, commercial building and
        remodeling any property <strong>Ruwali Construction & Suppliers Pvt. Ltd.</strong> offers long lasting, efficient plumbing system,
        perfect water supply and well organized water drainage. Plumbing work will always coordinate with
        architecture, engineering and other professionals works.
    </p>

    <h3>Water Supply System Installing</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-2.jpg" alt="Water Supply System Installing">
    </div>

    <p>
        <strong>Ruwali Construction & Suppliers Pvt. Ltd.</strong> provides installing hot and cold water pipe system works with the good
        quality materials such as PPR, CPVC, UPVC and HDPE pipes for your residence and commercial project.
        Our water supply installation will fulfill your desire of getting sufficient and persistent water
        pressure along with leak-free water system for your home. Pipe laying is arranged considering
        maintenance ease and future required expansion.
    </p>

    <h3>Bathroom and Kitchen Plumbing</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-3.jpg" alt="Bathroom and Kitchen Plumbing">
    </div>

    <p>
        Our professional plumber will install concealed and exposed water and drainage lines for kitchen,
        bathrooms, laundry and other related utilities. Installation of bathroom fittings, kitchen fittings
        etc shall be done considering their modern and stylish designs to ensure beautiful and hygiene place
        for daily use. Proper coordination with internal fitting works will be maintained for neat finish
        and accessibility.
    </p>

    <h3>Drainage and Sewer System Installing</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-4.jpg" alt="Drainage and Sewer System Installing">
    </div>

    <p>
        Water supply system needs a properly installed drainage and sewer system to work effectively.
        We install underground drainage line, sanitary pipeline, sewer line, inspection chamber, manhole
        and floor drain fitting for complete and correct working of drainage and sewer system for every
        type of building. Proper sloping and joining of pipes will avoid problem such as blockage and leakage.
    </p>

    <h3>Water Tank and Pump System Installing</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-5.jpg" alt="Water Tank and Pump System Installing">
    </div>

    <p>
        <strong> Ruwali Construction & Supplies pvt. Ltd. </strong> install underground and over head water tank for saving of water for
        requirement. The installation of transfer pump, pressuring system, filter connection will provide
        sufficient supply of water in multi storied apartment, hostel and commercial building. This will
        fulfill the need of water supply even for elevated floors.
    </p>

    <h3>Pipe Replacing and Plumbing Works in Renovation Project</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-6.jpg" alt="Pipe Replacing and Plumbing Renovation">
    </div>

    <p>
        We also install and repair existing old and leaky pipelines with new and modern plumbing pipes in
        existing home or apartment, hotel or commercial building which will be economical in long run for
        maintenance and water saving. Renovation plumbing works at home/ office will be carried out without
        much disruption at the site.
    </p>

    <h3>Testing, Commission and Inspection of Plumbing Works</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-7.jpg" alt="Testing and Inspection of Plumbing Works">
    </div>

    <p>
        After completing the plumbing installations all work undergo quality control check such as pressure
        testing, leak test, flow test etc. And then handed over to the customer after commission. Strict
        observation is maintained at every step for ensuring long lasting and maintenance-free plumbing system.
    </p>

    <h3>Our Plumbing Work Include</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-8.jpg" alt="Our Plumbing Work Include">
    </div>

    <ul>
        <li>Complete installing water supply systems</li>
        <li>Hot and cold water piping</li>
        <li>Bathroom and kitchen plumbing works</li>
        <li>Sanitary and drainage system constructions</li>
        <li>Sewer line construction and repairs</li>
        <li>Stormwater drainage system construction</li>
        <li>Underground & over head water tank installment and connecting</li>
        <li>Water pump installment and pressure boosting system</li>
        <li>Pipe renovation and replacement</li>
        <li>Leak identification and plumbing maintenance</li>
        <li>Pressuring test of all pipe works and plumbing commissioning</li>
        <li>Installation of plumbing system for hotel, apartment, office, and commercial building</li>
    </ul>

    <h3>Why Ruwali Construction Group for Your Plumbing Work?</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-9.jpg" alt="Why Ruwali Construction Group">
    </div>

    <p>
        <strong> Ruwali Construction & Supplies pvt. Ltd. </strong> has professional plumber who always use high quality of pipes, fitting,
        valves, sanitary fixture and water component manufactured from famous industries. We always give
        priority for precise pipe sizing, error-free installation, leak prevention, save water, long term
        system maintenance and high performance. We make sure to complete all project on time with good
        cooperation and understanding among internal and external work.
    </p>

    <h3>Application</h3>

    <div class="detail-banner-wrap">
        <img src="img/plumbing-10.jpg" alt="Plumbing Applications">
    </div>

    <p>
        For every kind of resident House & villa, Apartment & residential building, Hotel &
        tourism based building, Office & Corporate Building, Shopping center and market complex,
        Industrial and warehouse building, School & hospital Building, Institutional Building,
        Building renovation and remodeling.
    </p>

    <p>
       <strong> Ruwali Construction & Supplies pvt. Ltd. </strong> believes that, A correctly installed plumbing system is the best
        requirement for a good life. We have always been keen to be perfectionist when work done with
        quality. We will work on any kind of plumbing installation and maintenance for the client across
        Nepal according to client specification and standard building code.
    </p>

</div>
`
    };

    const slider = document.getElementById('servicesSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const closeAllBtn = document.getElementById('closeAllBtn');
    const serviceDetailView = document.getElementById('serviceDetailView');
    const serviceDetailContent = document.getElementById('serviceDetailContent');
    const allServicesView = document.getElementById('allServicesView');
    const allServicesGrid = document.getElementById('allServicesGrid');

    if (prevBtn && nextBtn && slider) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -300, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    function displayServiceDetail(serviceId) {
        if (!serviceDetailContent || !serviceDetailView) return;
        const content = serviceData[serviceId] || `
            <h2>Service Details</h2>
            <p class="mt-3">Detailed information for this service will be updated shortly.</p>
        `;
        serviceDetailContent.innerHTML = content;
        serviceDetailView.style.display = 'block';
        serviceDetailView.style.zIndex = "10000";
    }

    document.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.card-action-btn');
        if (targetBtn) {
            const serviceId = targetBtn.getAttribute('data-service-id');
            if (serviceId) {
                displayServiceDetail(serviceId);
            }
        }
    });

    if (closeDetailBtn && serviceDetailView) {
        closeDetailBtn.addEventListener('click', () => {
            serviceDetailView.style.display = 'none';
        });
    }

    if (viewAllBtn && allServicesGrid && slider && allServicesView) {
        viewAllBtn.addEventListener('click', () => {
            allServicesGrid.innerHTML = slider.innerHTML;

            const cards = allServicesGrid.querySelectorAll('.service-slide-card');
            cards.forEach(card => {
                const wrapper = document.createElement('div');
                wrapper.className = 'col-lg-4 col-md-6 mb-4';
                card.style.minWidth = '100%';
                card.style.maxWidth = '100%';
                card.parentNode.insertBefore(wrapper, card);
                wrapper.appendChild(card);
            });

            allServicesView.style.display = 'block';
        });
    }

    if (closeAllBtn && allServicesView) {
        closeAllBtn.addEventListener('click', () => {
            allServicesView.style.display = 'none';
        });
    }

    // Auto-load blog section on page load if container exists
    loadBlogSection();
});
// Mobile Drawer Pages Accordion Toggle (Permanent Fix)
document.addEventListener('click', function (e) {
    // Check if clicked element or its parent is mobilePagesToggle
    const toggleBtn = e.target.closest('#mobilePagesToggle');
    
    if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        const pagesMenu = document.getElementById('mobilePagesMenu');
        const chevron = document.getElementById('mobileChevron');
        
        if (pagesMenu) {
            // Dropdown open छ कि close चेक गर्ने
            const isHidden = window.getComputedStyle(pagesMenu).display === 'none';
            
            pagesMenu.style.display = isHidden ? 'block' : 'none';
            
            // Chevron Icon घुमाउने (Rotate Animation)
            if (chevron) {
                chevron.style.transition = 'transform 0.3s ease';
                chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    }
});
document.getElementById('viewAllBtn').addEventListener('click', function() {
  const extraCards = document.querySelectorAll('.extra-service');
  
  extraCards.forEach(card => {
    card.classList.toggle('show');
  });

  // Button को Text परिवर्तन गर्न (Toggle functionality)
  if (this.innerText === "View All Services") {
    this.innerText = "Show Less";
  } else {
    this.innerText = "View All Services";
  }
});
