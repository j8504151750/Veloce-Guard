
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    function addImageScaleAnimation() {
        gsap.utils.toArray("section").forEach((section, index) => {
            const image = document.querySelector(`#preview-${index + 1} img`);

            if (image) {
                const startCondition = "bottom bottom";

                gsap.to(image, {
                    scrollTrigger: {
                        trigger: section,
                        start: startCondition,
                        end: () => {
                            const viewportHeight = window.innerHeight;
                            const sectionBottom = section.offsetTop + section.offsetHeight;
                            const additionalDistance = viewportHeight * 0.5;
                            const endValue = sectionBottom - viewportHeight + additionalDistance;
                            return `+=${endValue}`;
                        },
                        scrub: 1,
                    },
                    scale: 3,
                    ease: "none",
                });
            }
        });
    }

    addImageScaleAnimation();

    function animateClipPath(
        sectionId,
        previewId,
        startClipPath,
        endClipPath,
        start = "top center",
        end = "bottom top"
    ) {
        let section = document.querySelector(sectionId);
        let preview = document.querySelector(previewId);

        if (section && preview) {
            ScrollTrigger.create({
                trigger: section,
                start: start,
                end: end,
                onEnter: () => {
                    gsap.to(preview, {
                        scrollTrigger: {
                            trigger: section,
                            start: start,
                            end: end,
                            scrub: 0.125,
                        },
                        clipPath: endClipPath,
                        ease: "none",
                    });
                },
            });
        }
    }

    animateClipPath(
        "#section-1",
        "#preview-1",
        "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    );

    const totalSections = 7;

    for (let i = 2; i <= totalSections; i++) {
        let currentSection = `#section-${i}`;
        let prevPreview = `#preview-${i - 1}`;
        let currentPreview = `#preview-${i}`;

        animateClipPath(
            currentSection,
            prevPreview,
            "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            "polygon(0% 0%, 100% 0%, 100% 0%, 0 0%)",
            "top bottom",
            "center center"
        );

        if (i < totalSections) {
            animateClipPath(
                currentSection,
                currentPreview,
                "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                "center center",
                "bottom top"
            );
        }
    }
});


// -----------------------MENU-----------------------------



// ------------------------開場動畫------------------------

window.addEventListener('load', () => {
    const openingTL = gsap.timeline();
    openingTL
        .to('.opening__logo', {
            duration: .5,
            ease: "power4.out",
            delay: .5,
            scale: 1,
            autoAlpha: 1
        })
        .to('.opening__logo', {
            duration: .5,
            filter: 'blur(5px)',
            autoAlpha: 0,
            scale: 1.1
        }, '+=1')
        .to('.opening__line', {
            duration: 1,
            scale: 1,
            ease: "power4.inOut",
        }, '+=.3')
        .to('.opening__mask--upper', {
            duration: .8,
            x: '-100%',
            ease: "power4.inOut",
        })
        .to('.opening__mask--under', {
            duration: .8,
            x: '100%',
            ease: "power4.inOut",
        }, '<')
        .to('.opening__line', {
            autoAlpha: 0,
        }, '<')
        .set('.opening', {
            display: 'none',
        })

})

// ------------------------開場動畫------------------------


// 輪播圖

var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop:true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 150,
      modifier: 2.5,
      slideShadows: true,
    },
    autoplay:{
  
      delay:3000,
      disableOnInteraction:false,
    }
  
  });

//   ----------------------------------------
// 輪播圖資料庫邏輯
fetch('/images')
.then(response => response.json())
.then(data => {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    data.forEach(imageInfo => {
        const slide = document.createElement('div');
        slide.classList.add('content', 'swiper-slide');
        slide.innerHTML = `
            <img src="${imageInfo.imagePath}" alt="${imageInfo.title}">
            <div class="text-content">
                <h3>${imageInfo.title}</h3>
                <p>${imageInfo.description}</p>
            </div>
        `;
        swiperWrapper.appendChild(slide);
    });
})
.catch(error => console.error('Error fetching images:', error));
// --------------------------------