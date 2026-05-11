// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-fill');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (barTop < windowHeight - 50) {
            bar.style.width = bar.style.width || '0%';
        }
    });
}

// Trigger animation on scroll
window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// Contact form handling
const contactForm = document.querySelector('.contact-form');
const messageList = document.querySelector('.message-list');
const inboxStatus = document.querySelector('.inbox-status');

async function loadMessages() {
    if (!messageList || !inboxStatus) return;

    inboxStatus.textContent = 'Memuat pesan...';
    try {
        const response = await fetch('/api/messages');
        if (!response.ok) throw new Error('Gagal memuat data.');
        const data = await response.json();
        renderMessages(data.messages);
        inboxStatus.textContent = data.messages.length ? `Total ${data.messages.length} pesan` : 'Belum ada pesan masuk.';
    } catch (error) {
        inboxStatus.textContent = 'Backend tidak terhubung. Jalankan server untuk melihat pesan.';
        messageList.innerHTML = '';
    }
}

function renderMessages(messages) {
    if (!messageList) return;
    if (!messages.length) {
        messageList.innerHTML = '<p style="grid-column:1/-1;color:var(--light-text);text-align:center;">Belum ada pesan untuk ditampilkan.</p>';
        return;
    }

    messageList.innerHTML = messages.map(msg => `
        <div class="message-card">
            <h3>${msg.name}</h3>
            <p>${msg.message}</p>
            <small>${msg.email} · ${new Date(msg.timestamp).toLocaleString('id-ID')}</small>
        </div>
    `).join('');
}

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            message: formData.get('message')?.trim()
        };

        let isValid = true;
        Object.entries(data).forEach(([key, value]) => {
            const input = this.querySelector(`[name="${key}"]`);
            if (!value) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#7f8c8d';
            }
        });

        if (!isValid) {
            alert('Mohon lengkapi semua field.');
            return;
        }

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengirim pesan.');
            }

            alert('Terima kasih! Pesan Anda telah dikirim.');
            this.reset();
            loadMessages();
        } catch (error) {
            alert(error.message || 'Gagal mengirim pesan. Pastikan server backend berjalan.');
        }
    });
}

function openPhotoModal(imageUrl, caption) {
    const modal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    if (!modal || !modalImage || !modalCaption) return;

    modalImage.src = imageUrl;
    modalImage.alt = caption;
    modalCaption.textContent = caption;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('click', (event) => {
    const openLink = event.target.closest('.photo-open, .photo-link');
    if (openLink) {
        event.preventDefault();
        const imageUrl = openLink.dataset.image;
        const title = openLink.dataset.title || openLink.textContent.trim();
        if (imageUrl) {
            openPhotoModal(imageUrl, title);
        }
    }

    if (event.target.closest('.modal-close') || event.target.id === 'photo-modal') {
        closePhotoModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closePhotoModal();
    }
});

loadMessages();

// Add scroll effect to header
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#ffffff';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});