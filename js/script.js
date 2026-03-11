
//⭐#header 축소
$(document).ready(function () {
    const $header = $("#header");
    const $aniItems = $(".ani_item");
    const $logoImg = $(".logo_img");
    const $mainTitle = $('#mainTitle'); // 🔴 배너 타이틀 객체

    // 이미지 경로 상수화
    const LOGO1 = "./images/logo.png";
    const LOGO2 = "./images/logo2.png";

    $(window).on('scroll', function () {
        const sct = $(this).scrollTop();
        const winH = $(this).height();

        // ⭐ 헤더 스크롤 제어
        if (sct > 100) {
            $header.addClass("header_scrolled");
            $logoImg.attr("src", LOGO2); // 스크롤 시 logo2
        } else {
            $header.removeClass("header_scrolled");
            $logoImg.attr("src", LOGO1); // 최상단 시 logo1
        }

        // 배너 및 섹션 애니메이션 제어
        const bannerTop = $("#banner").offset().top;
        if (sct > bannerTop - winH + (winH * 0.2)) {
            $aniItems.addClass("active");
        }

        const c1Top = $('#simbol').offset().top;
        if (sct > c1Top - winH * 0.85) $('#simbol').addClass('active');

        const c2Top = $('#under_btn').offset().top;
        if (sct > c2Top - winH * 0.85) $('#under_btn').addClass('active');

        const c3Top = $('#curation').offset().top;
        if (sct > c3Top - winH * 0.85) $('#curation').addClass('active');
    });

    // ⭐ 마우스 호버 시 확장 및 로고 원복 (logo2 -> logo1)
    $header.hover(
        function () {
            // 마우스 올렸을 때: 스크롤 상태와 상관없이 원래 디자인(LOGO1)으로
            $(this).removeClass("header_scrolled");
            $logoImg.attr("src", LOGO1);
        },
        function () {
            // 마우스 뗐을 때: 스크롤 위치가 100 이상이면 다시 축소 상태(LOGO2)로
            if ($(window).scrollTop() > 100) {
                $(this).addClass("header_scrolled");
                $logoImg.attr("src", LOGO2);
            }
        }
    );

    // 초기 로드 시 체크
    $(window).trigger('scroll');
});

// ⭐.util .lang 선택요소
$(function () {
    // .option 요소는 처음에 숨김 (CSS display:none 또는 hide())
    $(".option").hide();

    // 1. 선택창 클릭 시 슬라이드 토글 및 화살표 회전
    $(".select_btn").click(function (e) {
        /* 📍 튕김 방지 추가 */
        e.preventDefault();
        e.stopPropagation(); // document 클릭 이벤트 전파 방지
        $(".option").stop().slideToggle(200);
        $(this).find(".arrow").toggleClass("turn");
    });

    // 2. 옵션(EN 또는 KO) 클릭 시 상호 교체 로직
    $(".option p a").click(function (e) {
        /* 📍 튕김 방지 추가 */
        e.preventDefault();
        e.stopPropagation();

        // 현재 상단 버튼의 텍스트와 클릭한 옵션의 텍스트 가져오기
        const prevLang = $(".select_btn p").text(); // 기존 언어 (예: KO)
        const nextLang = $(this).text();           // 바뀔 언어 (예: EN)

        // 상단 버튼 텍스트 변경
        $(".select_btn p").text(nextLang);

        // 로직: 클릭한 항목은 숨기고, 기존에 상단에 있던 항목은 옵션 리스트에서 다시 보여줌
        $(this).hide();
        $(".option p a").filter(function () {
            return $(this).text() === prevLang;
        }).show();

        // 슬라이드 닫기 및 화살표 원상복구
        $(".option").slideUp(200);
        $(".select_btn .arrow").removeClass("turn");

        // 📍 추가: 필요 시 여기에 페이지 새로고침 로직 삽입 가능
        // window.location.reload(); 
    });

    // 3. 외부 영역 클릭 시 닫기
    $(document).click(function () {
        $(".option").slideUp(200);
        $(".select_btn span").removeClass("turn");
    });

    // 헤더 배경 전환 로직 유지
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#header').css('background', 'rgba(255, 255, 255, 0.95)');
        } else {
            $('#header').css('background', 'rgba(255, 255, 255, 0.9)');
        }
    });
});


//⭐#banner 글자요소
$(document).ready(function () {
    const $title = $('#dynamic-title');
    const $glow = $('#glow');
    const htmlContent = $title.html();
    const rawHtml = htmlContent ? htmlContent.trim() : ""; $title.empty();

    // 1. 텍스트 글자 단위 분리
    const parts = rawHtml.split(/(<span.*?>.*?<\/span>|\s+)/);
    parts.forEach(part => {
        if (!part) return;
        if (part.startsWith('<span')) {
            const text = $(part).text();
            const $span = $('<span class="highlight"></span>');
            splitChars(text, $span);
            $title.append($span);
        } else if (part.trim() === '') {
            $title.append('<span class="char">&nbsp;</span>');
        } else {
            splitChars(part, $title);
        }
    });

    function splitChars(text, container) {
        text.split('').forEach(c => {
            container.append(`<span class="char">${c}</span>`);
        });
    }

    // 2. 마우스 추적 조명 효과 (bg-glow)
    $(document).on('mousemove', function (e) {
        gsap.to($glow, {
            duration: 0.6,
            left: e.clientX,
            top: e.clientY,
            ease: "power2.out"
        });

        // 마우스 움직임에 따른 배경 물결 미세 반응
        gsap.to(".ocean-waves", {
            duration: 2,
            x: (e.clientX - window.innerWidth / 2) * 0.03,
            y: (e.clientY - window.innerHeight / 2) * 0.03,
            ease: "sine.out"
        });
    });

    // 3. 배경 물결 애니메이션 (지속적 일렁임)
    gsap.to("#wave-path-1", {
        attr: { d: "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,160C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" },
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to("#wave-path-2", {
        attr: { d: "M0,224L48,240C96,256,192,288,288,277.3C384,267,480,213,576,197.3C672,181,768,203,864,224C960,245,1056,267,1152,261.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" },
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 4. 메인 애니메이션 타임라인 (심볼 -> 텍스트 전환)
    const tl = gsap.timeline();

    // 단계 1: 심볼들 통통 튀어나오기
    tl.to(".symbol", {
        duration: 0.8,
        opacity: 1,
        y: -50,
        scale: 1.2,
        stagger: 0.1,
        ease: "back.out(2)"
    })
        // 단계 2: 심볼들이 중앙으로 모이며 회전 (브랜드 에너지 응집)
        .to(".symbol", {
            duration: 0.6,
            x: (i) => (1.5 - i) * 35,
            rotation: 360,
            scale: 0.5,
            opacity: 0.6,
            ease: "power2.inOut"
        })
        // 단계 3: 심볼 폭발하며 텍스트 등장
        .to(".symbol", {
            duration: 0.3,
            scale: 5,
            opacity: 0,
            filter: "blur(15px)",
            ease: "expo.out"
        })
        .set($title, { visibility: "visible" }, "-=0.2")
        .from(".char", {
            duration: 1.2,
            opacity: 0,
            scale: 0,
            y: 60,
            filter: "blur(10px)",
            stagger: 0.04,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.1")
        // 단계 4: PLAY 단어 무한 바운스
        .to(".highlight .char", {
            y: -12,
            duration: 0.4,
            repeat: -1,
            yoyo: true,
            stagger: 0.08,
            ease: "power1.inOut"
        });

    // 5. 개별 글자 마우스 호버 인터랙션 (물결 컬러 반영)
    const colors = ['#1D4ED8', '#FB923C', '#2DD4BF', '#F43F5E'];
    $(".char").on("mouseenter", function () {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        gsap.to(this, {
            y: -15,
            scale: 1.3,
            color: randomColor,
            duration: 0.3,
            ease: "back.out(3)"
        });
    }).on("mouseleave", function () {
        gsap.to(this, {
            y: 0,
            scale: 1,
            color: "",
            duration: 0.5,
            ease: "power2.out"
        });
    });

    // //⭐banner 동영상
    // (function () {
    //     window.addEventListener('load', function () {
    //         const videoList = [
    //             './media/video2.mp4',
    //             './media/video1.mp4',
    //             './media/video3.mp4'
    //         ];

    //         let currentIndex = 0;
    //         const players = [
    //             document.getElementById('video1'),
    //             document.getElementById('video2')
    //         ];
    //         let activeIdx = 0;

    //         players[activeIdx].src = videoList[currentIndex];

    //         function prepareNext() {
    //             const currentVideo = players[activeIdx];
    //             const nextPlayerIdx = (activeIdx + 1) % 2;
    //             const nextVideo = players[nextPlayerIdx];

    //             currentIndex = (currentIndex + 1) % videoList.length;

    //             // 💡 ontimeupdate 감지 시간을 더 여유 있게 설정 (1.5초 전)
    //             currentVideo.ontimeupdate = function () {
    //                 if (currentVideo.duration - currentVideo.currentTime < 1.5) {
    //                     currentVideo.ontimeupdate = null;

    //                     nextVideo.src = videoList[currentIndex];
    //                     // 💡 play()가 완료된 시점(영상이 실제로 돌기 시작할 때)에 페이드 시작
    //                     nextVideo.play().then(() => {
    //                         // 💡 z-index를 조절하여 새 영상이 확실히 위로 올라오게 함
    //                         nextVideo.style.zIndex = "2";
    //                         currentVideo.style.zIndex = "1";

    //                         // 💡 두 영상의 투명도를 동시에 조절 (Cross-fade)
    //                         nextVideo.style.opacity = "1";
    //                         currentVideo.style.opacity = "0";

    //                         activeIdx = nextPlayerIdx;
    //                         prepareNext();
    //                     }).catch(err => {
    //                         // 💡 만약 재생 준비가 안 됐다면 짧은 대기 후 재시도
    //                         console.log("Waiting for video decode...");
    //                     });
    //                 }
    //             };
    //         }

    //         prepareNext();
    //     });
    // })();
});

//⭐.simbol simbol요소
// $(document).ready(function () {
//     // 스크롤 이벤트 핸들러
//     $(window).on('scroll', function () {
//         var sct = $(window).scrollTop();
//         var winH = $(window).height();

//         // 1. 인트로 섹션 애니메이션 트리거
//         var simbol = $('#simbol');
//         if (simbol.length) {
//             var simbolTop = simbol.offset().top;
//             // 트리거 범위를 winH * 0.8로 넓혀서 조금 더 일찍 실행되도록 조정
//             if (sct > simbolTop - winH * 0.8) {
//                 simbol.addClass('active');
//             }
//         }

//         // 2. 프로젝트 섹션 애니메이션 트리거
//         var under_btn = $('#under_btn');
//         if (under_btn.length) {
//             var under_btnTop = under_btn.offset().top;
//             if (sct > under_btnTop - winH * 0.8) {
//                 under_btn.addClass('active');
//             }
//         }

//         // 3. 헤더 스타일 제어
//         if (sct > 50) {
//             $('#header').css('background', 'rgba(15, 23, 42, 0.98)');
//         } else {
//             $('#header').css('background', 'rgba(15, 23, 42, 0.9)');
//         }
//     });

//     // 초기 스크롤 위치 체크 (새로고침 대응)
//     $(window).trigger('scroll');

//     //⭐.under_btn
//     // 2. 프로젝트 섹션(under_btn) 애니메이션
//     const $under_btn = $('#under_btn');
//     if ($under_btn.length) {
//         const c2Top = $under_btn.offset().top;
//         // 트리거 시점을 조금 더 미세하게 조정하여 화면 중간 즈음에서 시작되도록 함
//         if (sct > c2Top - winH * 0.9) {
//             $under_btn.addClass('active');
//         }
//     }
// });

// 마우스 움직임에 따라 도형들이 역동적으로 반응하고 회전하는 효과
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');

    // 화면 중심으로부터의 거리 계산 (비율)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const mouseX = (e.pageX - centerX) / centerX; // -1 ~ 1 사이 값
    const mouseY = (e.pageY - centerY) / centerY; // -1 ~ 1 사이 값

    shapes.forEach((shape, index) => {
        // 도형마다 각기 다른 가중치를 부여하여 움직임의 차이를 둠
        const factor = (index + 1) * 2; // 위치 이동 강도
        const rotateFactor = (index + 1) * 45; // 회전 강도 (최대 45도 이상)

        const translateX = mouseX * factor * 2; // 가로 이동 폭 증가
        const translateY = mouseY * factor * 2; // 세로 이동 폭 증가
        const rotation = mouseX * rotateFactor; // 마우스 가로 위치에 따른 회전

        // transform을 사용하여 위치 이동과 회전을 동시에 적용
        shape.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
    });
});

// 마우스가 화면을 벗어날 때 원래 위치로 부드럽게 복구
document.addEventListener('mouseleave', () => {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape) => {
        shape.style.transform = `translate(0px, 0px) rotate(0deg)`;
    });
});


//⭐.content3
$(function () {
    // 헤더 투명도 조절
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#header').css('background', 'rgba(224, 224, 224, 0.8)'), $('#header').css('color', '#555');
        } else {
            $('#header').css('background', 'rgba(255, 255, 255, 0.02)'), $('#header').css('color', '#fff');
        }
    });

    // 간단한 호버 인터렉션
    $('.sub_item').hover(function () {
        $(this).find('h4').css('color', '#ff2d78');
    }, function () {
        $(this).find('h4').css('color', '#111');
    });
});

// ⭐space
// $(document).ready(function () {
//     // 1. 카테고리 필터링 기능
//     $('.filter-btn').on('click', function () {
//         const filter = $(this).data('filter');

//         // 버튼 활성화 표시
//         $('.filter-btn').removeClass('active');
//         $(this).addClass('active');

//         // 필터링 시 모든 카드의 활성 상태 초기화
//         $('.card').removeClass('is-active');

//         // 리스트 필터링
//         if (filter === 'all') {
//             $('.card').stop().fadeIn(300);
//         } else {
//             $('.card').stop().hide();
//             $(`.card[data-category="${filter}"]`).stop().fadeIn(300);
//         }
//     });

//     // 2. 카드 클릭 인터랙션 (호버 대신 클릭으로 변경)
//     $(document).on('click', '.card', function () {
//         const isActive = $(this).hasClass('is-active');

//         // 클릭한 카드가 이미 활성 상태라면 닫기, 아니면 다른 카드 닫고 현재 카드 열기
//         if (isActive) {
//             $(this).removeClass('is-active');
//         } else {
//             $('.card').removeClass('is-active');
//             $(this).addClass('is-active');

//             // 클릭 시 해당 카드가 스크롤 영역 안으로 잘 들어오도록 처리 (선택 사항)
//             const container = $('.scroll-list');
//             const scrollTo = $(this);
//             container.animate({
//                 scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - 20
//             }, 500);
//         }
//     });
// });

// ⭐이벤트, 굿즈섹션
$(document).ready(function () {
    // 📍 [추가] 🎬 스크롤 모션 로직
    $(window).on('scroll', function () {
        const sct = $(window).scrollTop(); // 현재 스크롤 위치
        const sectionTop = $('#section4').offset().top; // 섹션의 시작 위치
        const winH = $(window).height(); // 브라우저 창 높이

        // 🏃 섹션이 화면의 80% 지점에 도달하면 active 클래스 부여
        if (sct > sectionTop - winH * 0.8) {
            $('#section4').addClass('active');
        }
    });

    // 📍 [추가] 🔄 초기 실행 (새로고침 시 해당 위치라면 바로 애니메이션)
    $(window).trigger('scroll');

    // --- 이하 기존 카드/필터 클릭 이벤트 유지 ---
    $('.card').on('click', function () {
        const isAlreadyActive = $(this).hasClass('is-active');
        $('.card').removeClass('is-active');
        if (!isAlreadyActive) {
            $(this).addClass('is-active');
            highlightMarker($(this).data('marker'));
            const container = $('.scroll-list');
            const scrollTo = $(this).position().top + container.scrollTop() - 20;
            container.stop().animate({ scrollTop: scrollTo }, 500);
        } else {
            resetMarkers();
        }
    });

    $('.filter-btn').on('click', function () {
        const filter = $(this).data('filter');
        $('.filter-btn').removeClass('active'); $(this).addClass('active');
        if (filter === 'all') { $('.card').stop().fadeIn(300); $('.marker').show(); }
        else { $('.card').hide(); $(`.card[data-category="${filter}"]`).stop().fadeIn(300); $('.marker').hide(); $(`.card[data-category="${filter}"]`).each(function () { $(`.marker[data-id="${$(this).data('marker')}"]`).show(); }); }
        $('.card').removeClass('is-active'); resetMarkers();
    });

    function highlightMarker(id) { $('.marker').css({ 'background': 'rgb(48, 114, 255)', 'transform': 'rotate(-45deg) scale(1)', 'z-index': '10' }); $(`.marker[data-id="${id}"]`).css({ 'background': '#ef4444', 'transform': 'rotate(-45deg) scale(1.3)', 'z-index': '20' }); }
    function resetMarkers() { $('.marker').css({ 'background': 'rgb(48, 114, 255)', 'transform': 'rotate(-45deg) scale(1)', 'z-index': '10' }); }
});


const wrapper = document.getElementById('sticky-wrapper');
const inner = document.getElementById('slide-inner');

function updateStickyHeight() {
    const slideWidth = inner.scrollWidth;
    const screenWidth = window.innerWidth;

    /**
     * 동작 속도 수정 핵심:
     * 가로 스크롤 거리(scrollDistance)에 곱해주는 배율을 높여서 
     * 세로 스크롤 구간을 더 길게(Longer) 만듭니다. 
     * 구간이 길어질수록 가로 이동 속도는 상대적으로 느려집니다.
     */
    const speedFactor = 3.5; // 기존보다 높은 배율 적용 (천천히 이동)
    const scrollDistance = (slideWidth - screenWidth) * speedFactor;

    wrapper.style.height = `${scrollDistance + window.innerHeight}px`;
}

function syncScroll() {
    const rect = wrapper.getBoundingClientRect();
    const totalScrollableHeight = wrapper.offsetHeight - window.innerHeight;

    // Sticky 영역에 있을 때 진행률 계산
    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const currentScrollProgress = Math.abs(rect.top) / totalScrollableHeight;

        const slideWidth = inner.scrollWidth;
        const screenWidth = window.innerWidth;
        const maxTranslateX = slideWidth - screenWidth + (screenWidth * 0.1);

        // 가로 이동 위치 적용
        inner.style.transform = `translateX(${-currentScrollProgress * maxTranslateX}px)`;
    } else if (rect.top > 0) {
        // 진입 전 상태 초기화
        inner.style.transform = `translateX(0px)`;
    } else if (rect.bottom < window.innerHeight) {
        // 완전히 지난 상태 고정
        const slideWidth = inner.scrollWidth;
        const screenWidth = window.innerWidth;
        const maxTranslateX = slideWidth - screenWidth + (screenWidth * 0.1);
        inner.style.transform = `translateX(${-maxTranslateX}px)`;
    }
}

// 초기 설정 및 리사이즈 감지
window.addEventListener('load', () => {
    updateStickyHeight();
    syncScroll();
});

window.addEventListener('resize', () => {
    updateStickyHeight();
    syncScroll();
});

// 스크롤 성능 최적화를 위한 틱 처리
window.addEventListener('scroll', () => {
    window.requestAnimationFrame(syncScroll);
});

// 요소 등장 애니메이션 감지
const observerOptions = { threshold: 0.1 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
});
