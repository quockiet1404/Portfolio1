// --- SCROLL REVEAL & HERO ANIMATION ---
        const isElementInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            return (rect.top <= windowHeight * 0.85 && rect.bottom >= 0); // Tăng ngưỡng nhìn thấy lên 85%
        };
        

        const revealElements = () => {
            const revealers = document.querySelectorAll('.scroll-reveal');
            revealers.forEach((el) => {
                // Kiểm tra xem phần tử có nằm trong tầm nhìn và CHƯA được reveal
                if (isElementInViewport(el) && !el.classList.contains('revealed')) { 
                    el.classList.add('revealed');
                    
                    // Áp dụng độ trễ cho mọi phần tử có data-delay (cho hiệu ứng staggered)
                    const delay = el.getAttribute('data-delay');
                    if (delay) {
                         el.style.transitionDelay = `${delay}s`;
                    }
                }
            });
        };
        
        // --- WAVY TEXT ANIMATION SCRIPT ---
        const applyWavyEffect = (elementId) => {
            const container = document.getElementById(elementId);
            if (!container) return;

            const text = container.textContent;
            let newHTML = '';
            
            // Xác định class CSS dựa trên ID
            const charClass = (elementId === 'wavy-contact-heading') ? 'wavy-char-white' : 'wavy-char';
            
            // Tách từng ký tự và áp dụng độ trễ
            for (let i = 0; i < text.length; i++) {
                // Thay thế khoảng trắng bằng &nbsp; để animation hoạt động trên cả khoảng trắng
                // Thêm một khoảng cách nhỏ cho chữ 
                const char = text[i] === ' ' ? '&nbsp;&nbsp;' : text[i]; 
                const delay = i * 0.1; // Độ trễ tăng dần 0.1s cho mỗi chữ
                
                newHTML += `<span class="${charClass}" style="animation-delay: ${delay}s;">${char}</span>`;
            }

            container.innerHTML = newHTML;
        };
        // ----------------------------------

        // --- PROGRESS BAR HOVER ANIMATION ---
        const setupProgressHover = () => {
            const skillItems = document.querySelectorAll('.skill-item');

            skillItems.forEach(item => {
                // Lấy giá trị phần trăm từ data-level (cho skill cứng/mềm)
                const level = item.getAttribute('data-level');
                const barFill = item.querySelector('.progress-bar-fill');

                // Khởi tạo trạng thái mặc định 
                barFill.style.width = '0%'; 

                item.addEventListener('mouseenter', () => {
                    barFill.style.width = level + '%';
                });

                item.addEventListener('mouseleave', () => {
                    barFill.style.width = '0%';
                });
                
                // Kích hoạt animation khi element được reveal (để đảm bảo thanh chạy khi load trang)
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            barFill.style.width = level + '%';
                            observer.unobserve(entry.target); 
                        }
                    });
                }, { threshold: 0.8 }); // Quan sát khi 80% element vào viewport

                observer.observe(item);
            });
        };

        // --- SCROLL HEADER BACKGROUND FOR READABILITY ---
        const handleHeaderScroll = () => {
            const header = document.querySelector('.main-header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        
        // --- CUSTOM VALIDATION MESSAGE SCRIPT (NEW) ---
        const setupCustomValidation = () => {
            const form = document.getElementById('contact-form');
            if (form) {
                // Lắng nghe sự kiện 'invalid' trên toàn bộ form
                form.addEventListener('invalid', function(e) {
                    // Đặt tin nhắn tùy chỉnh cho tất cả các input bị fail validation
                    e.target.setCustomValidity('Vui lòng điền nội dung'); 
                }, true); // Sử dụng phase capturing để bắt sự kiện trước khi nó bubbled lên
                
                // Lắng nghe sự kiện 'input' để reset tin nhắn lỗi
               // --- CUSTOM VALIDATION MESSAGE SCRIPT (NEW) - ĐÃ SỬA LỖI ---
        const setupCustomValidation = () => {
            const form = document.getElementById('contact-form');
            if (form) {
                // Lắng nghe sự kiện 'invalid' để đặt tin nhắn lỗi tùy chỉnh
                form.addEventListener('invalid', function(e) {
                    // Đặt tin nhắn tùy chỉnh khi validation fail
                    e.target.setCustomValidity('Vui lòng điền nội dung'); 
                }, true); 
                
                // Lắng nghe sự kiện 'input' để reset tin nhắn lỗi
                form.addEventListener('input', function(e) {
                    // FIX: Phải reset custom validity message (về rỗng) ngay lập tức khi có input
                    // Điều này cho phép trình duyệt kiểm tra lại tính hợp lệ dựa trên thuộc tính HTML (required, type,...)
                    e.target.setCustomValidity(''); 
                });
            }
        };
            }
        };


        // --- MAILTO UTF-8 ENCODING FIX (Sửa lỗi font tiếng Việt khi gửi mail) ---
        const setupMailtoFix = () => {
            const form = document.getElementById('contact-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    // *BỎ* e.preventDefault() ở đây nếu muốn dùng browser validation trước, 
                    // nhưng vì ta muốn chuyển hướng mailto sau khi validation thành công, nên giữ lại.
                    // Tuy nhiên, việc dùng JS để hiển thị lỗi validation tùy chỉnh 
                    // thường được đặt trước logic gửi mail/mailto.
                    
                    // Để giữ nguyên logic mailto hiện có:
                    if (!form.checkValidity()) {
                        // Nếu form không hợp lệ, browser sẽ tự động hiển thị lỗi 
                        // (lỗi đã được setCustomValidity ở hàm setupCustomValidation)
                        // và ngăn chặn sự kiện submit.
                        return;
                    }
                    
                    e.preventDefault(); // Ngăn chặn hành động gửi form mặc định (vì mailto sẽ xử lý)

                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const subject = document.getElementById('subject').value;
                    const message = document.getElementById('message').value;

                    // Xây dựng nội dung email (body)
                    const emailBody = 
                        "Tên: " + name + "\n" +
                        "Email: " + email + "\n" +
                        "Chủ đề: " + subject + "\n" + // Thêm chủ đề vào body để người nhận dễ thấy
                        "------------------\n" +
                        "Nội dung:\n" + message;

                    // MÃ HÓA UTF-8 CHO CÁC THÀNH PHẦN (Đây là bước quan trọng nhất để sửa lỗi font)
                    const encodedSubject = encodeURIComponent("Liên hệ từ Portfolio (" + name + "): " + subject); // Cập nhật Subject rõ ràng hơn
                    const encodedBody = encodeURIComponent(emailBody);

                    // Xây dựng liên kết mailto hoàn chỉnh
                    const mailtoLink = 
                        "mailto:rinnkiet@gmail.com" + 
                        "?subject=" + encodedSubject + 
                        "&body=" + encodedBody;

                    // Mở ứng dụng email mặc định
                    window.location.href = mailtoLink;
                });
            }
        };
        // --------------------------------------------------------------------------

        // Lắng nghe sự kiện tải trang và cuộn
        window.addEventListener('scroll', revealElements);
        window.addEventListener('scroll', handleHeaderScroll);
        
        // --- BACK TO TOP SCRIPT ĐƯỢC THÊM VÀO ĐÂY ---
        
        // 1. Hàm cuộn về đầu trang (dùng khi click)
        function scrollToTop() {
            // Sử dụng smooth scroll nếu trình duyệt hỗ trợ
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // 2. Hàm xử lý hiển thị/ẩn nút (dùng khi cuộn)
        const toggleBackToTopButton = () => {
            const button = document.getElementById('back-to-top');
            
            // Lấy chiều cao của cửa sổ và vị trí cuộn hiện tại
            const scrollThreshold = window.innerHeight; // Hiển thị nút sau khi cuộn qua một chiều cao cửa sổ
            
            if (window.scrollY > scrollThreshold) {
                button.style.display = 'block'; // Hiện nút
            } else {
                button.style.display = 'none'; // 
            }
        };
        
        // Thêm trình lắng nghe sự kiện cuộn
        window.addEventListener('scroll', toggleBackToTopButton);
        // ---------------------------------------------
        
        document.addEventListener('DOMContentLoaded', () => {
            revealElements(); 
            setupProgressHover();
            initParticles(); 
            applyWavyEffect('wavy-name-container'); // Áp dụng hiệu ứng sóng XANH cho tên
            applyWavyEffect('wavy-contact-heading'); // Áp dụng hiệu ứng sóng TRẮNG cho tiêu đề Liên hệ
            setupCustomValidation(); // THÊM HÀM CUSTOM VALIDATION MESSAGE
            setupMailtoFix(); // THÊM HÀM SỬA LỖI FONT
            // Gọi lần đầu để kiểm tra nút "Back to Top" ngay khi load trang
            toggleBackToTopButton();
        }); 
        
        // Gọi lần đầu để xử lý các phần tử đầu trang
        revealElements();

        // --- PARTICLE ANIMATION (JAVASCRIPT) ---
        function initParticles() {
            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = 200; 

            // Set canvas size
            function setCanvasSize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            setCanvasSize();
            window.addEventListener('resize', setCanvasSize);

            // Hàm vẽ bông tuyết 6 cánh phức tạp (MỚI ĐƯỢC THÊM VÀO)
            function drawSnowflake(context, x, y, size, rotation) {
                context.save();
                context.translate(x, y);
                context.rotate(rotation);
                context.beginPath();
                
                const arms = 6;
                const radius = size;
                const branchLength = radius * 0.4;
                const branchGap = radius * 0.2;

                for (let i = 0; i < arms; i++) {
                    const angle = (i * 2 * Math.PI) / arms;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);

                    // Di chuyển đến trung tâm và vẽ cánh chính
                    context.moveTo(0, 0);
                    context.lineTo(radius * cos, radius * sin);

                    // Vị trí nhánh phụ thứ nhất
                    const x1 = branchGap * cos;
                    const y1 = branchGap * sin;

                    // Tính toán hướng của nhánh phụ (vuông góc với cánh chính)
                    const perpAngle1 = angle + Math.PI / 3; 
                    const x1a = x1 + branchLength * Math.cos(perpAngle1);
                    const y1a = y1 + branchLength * Math.sin(perpAngle1);
                    const x1b = x1 + branchLength * Math.cos(perpAngle1 - Math.PI);
                    const y1b = y1 + branchLength * Math.sin(perpAngle1 - Math.PI);

                    // Vẽ nhánh phụ thứ nhất
                    context.moveTo(x1, y1);
                    context.lineTo(x1a, y1a);
                    context.moveTo(x1, y1);
                    context.lineTo(x1b, y1b);
                    
                    // Vị trí nhánh phụ thứ hai (gần đầu cánh)
                    const x2 = (radius - branchGap) * cos;
                    const y2 = (radius - branchGap) * sin;

                    // Tính toán hướng của nhánh phụ thứ hai
                    const perpAngle2 = angle + Math.PI / 3;
                    const x2a = x2 + branchLength * 0.6 * Math.cos(perpAngle2);
                    const y2a = y2 + branchLength * 0.6 * Math.sin(perpAngle2);
                    const x2b = x2 + branchLength * 0.6 * Math.cos(perpAngle2 - Math.PI);
                    const y2b = y2 + branchLength * 0.6 * Math.sin(perpAngle2 - Math.PI);

                    // Vẽ nhánh phụ thứ hai
                    context.moveTo(x2, y2);
                    context.lineTo(x2a, y2a);
                    context.moveTo(x2, y2);
                    context.lineTo(x2b, y2b);
                }

                context.lineWidth = 1;
                context.strokeStyle = `rgba(255, 255, 255, ${context.globalAlpha})`;
                context.lineCap = 'round';
                context.stroke();
                context.restore();
            }

            // Function to draw a polygon (used for simple shapes)
            function drawPolygon(context, x, y, size, numSides, rotation) {
                context.save();
                context.translate(x, y);
                context.rotate(rotation);
                context.beginPath();
                for (let i = 0; i < numSides; i++) {
                    const angle = (i * 2 * Math.PI) / numSides;
                    const sx = size * Math.cos(angle);
                    const sy = size * Math.sin(angle);
                    if (i === 0) {
                        context.moveTo(sx, sy);
                    } else {
                        context.lineTo(sx, sy);
                    }
                }
                context.closePath();
                context.fill(); // Sử dụng fill cho các hình đa giác đơn giản
                context.restore();
            }

            // Function to draw a simple circle
            function drawCircle(context, x, y, size) {
                context.beginPath();
                context.arc(x, y, size, 0, Math.PI * 2); 
                context.closePath();
                context.fill();
            }


            // Particle constructor (for snowflakes)
            function Particle(x, y, size, color, shapeType) {
                this.x = x;
                this.y = y;
                // ĐÃ SỬA: Giảm kích thước tối đa của bông tuyết phức tạp
                this.size = (shapeType === 'snowflake') ? (Math.random() * 2 + 1.5) : size; 
                this.color = color;
                this.velocity = {
                    x: Math.random() * 0.4 - 0.2, 
                    y: Math.random() * 0.3 + 0.1 
                };
                this.alpha = 1; 
                this.windInfluence = Math.random() * 0.05 + 0.01; 
                this.rotation = Math.random() * Math.PI * 2; 
                this.rotationSpeed = (Math.random() - 0.5) * 0.02; 
                this.shapeType = shapeType; 
            }

            Particle.prototype.draw = function() {
                ctx.globalAlpha = this.alpha; // Đặt alpha cho toàn bộ drawing
                ctx.shadowColor = `rgba(255, 255, 255, ${this.alpha * 0.9})`; 
                ctx.shadowBlur = this.size * 2; // Giảm shadow blur

                if (this.shapeType === 'snowflake') {
                    // SỬ DỤNG HÀM MỚI VẼ BÔNG TUYẾT PHỨC TẠP
                    drawSnowflake(ctx, this.x, this.y, this.size, this.rotation);
                } 
                else if (this.shapeType.startsWith('polygon')) {
                    // Dùng fill cho đa giác đơn giản
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; 
                    const sides = parseInt(this.shapeType.replace('polygon', ''));
                    drawPolygon(ctx, this.x, this.y, this.size, sides, this.rotation);
                } 
                else if (this.shapeType === 'circle') {
                    // Dùng fill cho hình tròn
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; 
                    drawCircle(ctx, this.x, this.y, this.size);
                }
                // Khôi phục lại alpha và shadow
                ctx.globalAlpha = 1;
            };

            Particle.prototype.update = function() {
                this.x += this.velocity.x + Math.sin(Date.now() * 0.0005 + this.y * this.windInfluence) * 0.5;
                this.y += this.velocity.y;
                this.rotation += this.rotationSpeed; 

                // Reset khi ra khỏi màn hình
                if (this.y - this.size > canvas.height) {
                    this.y = -this.size; 
                    this.x = Math.random() * canvas.width; 
                    this.alpha = 1; 
                    this.rotation = Math.random() * Math.PI * 2; 
                    this.shapeType = getRandomShapeType(); 
                    // Cập nhật lại kích thước nếu là bông tuyết phức tạp
                    if (this.shapeType === 'snowflake') {
                        // ĐÃ SỬA: Giảm kích thước khi reset
                        this.size = Math.random() * 2 + 1.5;
                    } else {
                        // ĐÃ SỬA: Giảm kích thước khi reset
                        this.size = Math.random() * 1 + 1;
                    }
                }

                // Fade out khi gần chạm đáy
                // ĐÃ SỬA: Đặt ngưỡng fade out gần đáy hơn (0.95) để hạt rơi xuống hết background
                if (this.y > canvas.height * 0.95) { 
                    this.alpha -= 0.01; // ĐÃ SỬA: Tăng tốc độ mờ dần một chút
                    if (this.alpha <= 0) { 
                        this.y = -this.size; 
                        this.x = Math.random() * canvas.width;
                        this.alpha = 1;
                        this.rotation = Math.random() * Math.PI * 2; 
                        this.shapeType = getRandomShapeType(); 
                        // Cập nhật lại kích thước
                        if (this.shapeType === 'snowflake') {
                            this.size = Math.random() * 2 + 1.5;
                        } else {
                            this.size = Math.random() * 1 + 1;
                        }
                    }
                // ĐÃ SỬA: Bỏ đoạn else if (this.alpha < 1) { this.alpha = 1; } 
                // vì nó làm tuyết bị bật trở lại độ mờ 100% khi chưa chạm đáy, khiến fade out không hoạt động.
                }

                this.draw();
            };

            // CẬP NHẬT: Thêm 'snowflake' vào mảng hình dạng
            const shapeTypes = ['snowflake', 'snowflake', 'snowflake', 'polygon6', 'circle', 'polygon5', 'polygon4', 'polygon3']; 
            // Lặp lại 'snowflake' để tăng khả năng xuất hiện của chúng (tỉ lệ 3/8)

            function getRandomShapeType() {
                return shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                }

            // Initialize particles
            function init() {
                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    const shapeType = getRandomShapeType();
                    // ĐÃ SỬA: Kích thước mặc định nhỏ cho các hạt đơn giản
                    let size = Math.random() * 1 + 1; 
                    // ĐÃ SỬA: Kích thước nhỏ hơn cho bông tuyết phức tạp
                    if (shapeType === 'snowflake') {
                        size = Math.random() * 2 + 1.5; 
                    }
                    
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height; 
                    const color = 'rgba(255, 255, 255, 0.8)'; 
                    particles.push(new Particle(x, y, size, color, shapeType));
                }
            }

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                ctx.shadowBlur = 0; 
                
                particles.forEach(particle => {
                    particle.update();
                });
            }

            init();
            animate();
        }
                
// --- MOBILE MENU TOGGLE SCRIPT ---
let isScrolling = false;

// --- MOBILE MENU TOGGLE SCRIPT ---
const setupMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Hàm tạm dừng Scroll Reveal sau khi chuyển hướng
    const debounceScroll = () => {
        isScrolling = true; // Tạm dừng reveal
        // Sau 1 giây (đủ thời gian để cuộn đến section), bật lại reveal
        setTimeout(() => {
            isScrolling = false; 
            // Kích hoạt reveal ngay lập tức sau khi bật lại
            revealElements(); 
        }, 1000); 
    };

    if (hamburger && navLinks) {
        // 1. Chức năng đóng/mở menu khi click vào nút Hamburger
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active'); 
            // Ngăn cuộn trang khi menu đang mở
            document.body.classList.toggle('no-scroll'); 
        });

        // 2. Chức năng đóng menu khi click vào một liên kết
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                // Đóng menu
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll'); 
                
                // Kích hoạt tạm dừng Scroll Reveal sau khi cuộn
                debounceScroll(); 
            });
        });
    }
};
// ----------------------------------

// Cập nhật DOMContentLoaded để gọi hàm mới
document.addEventListener('DOMContentLoaded', () => {
    revealElements(); 
    setupProgressHover();
    initParticles(); 
    applyWavyEffect('wavy-name-container'); 
    applyWavyEffect('wavy-contact-heading'); 
    setupCustomValidation(); 
    setupMailtoFix(); 
    toggleBackToTopButton();
    setupMobileMenu(); // <--- ĐẢM BẢO GỌI HÀM NÀY
});