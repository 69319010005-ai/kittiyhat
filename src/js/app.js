document.addEventListener('DOMContentLoaded', () => {
    // --- 1. การกำหนดตัวแปร DOM ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const toastContainer = document.getElementById('toastContainer');

    // --- 2. ฟังก์ชันแสดง/ซ่อนรหัสผ่าน (Password Visibility) ---
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // สลับไอคอนตา
        if (type === 'text') {
            togglePasswordBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>`;
        } else {
            togglePasswordBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>`;
        }
    });

    // --- 3. ระบบแสดงแจ้งเตือนแบบ Toast (แทน Alert ที่รบกวนผู้ใช้) ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // ใส่ไอคอนตามสถานะ
        const icon = type === 'success' 
            ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        // ลบ Toast อัตโนมัติหลัง 3 วินาที
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s backwards reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- 4. ฟังก์ชันตรวจสอบอีเมล (Validation) ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // --- 5. จัดการเมื่อกดปุ่ม Submit ฟอร์ม ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // หยุดการรีเฟรชหน้าเว็บ

        // ล้าง Error เดิมก่อน
        emailInput.parentElement.classList.remove('error');
        
        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();

        // ตรวจสอบความถูกต้องฝั่ง Client (Client-side Validation)
        if (!validateEmail(emailVal)) {
            emailInput.parentElement.classList.add('error');
            return;
        }

        // ปรับ UI เป็นสถานะกำลังโหลด (Loading State)
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';

        try {
            // จำลองการเชื่อมต่อ API / Firebase Authentication (รอ 1.5 วินาที)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // ตรรกะจำลองการตรวจสอบรหัสผ่าน
            if (emailVal === 'admin@enterprise.com' && passwordVal === 'password') {
                showToast('เข้าสู่ระบบสำเร็จ กำลังพาไปยัง Dashboard...', 'success');
                // Code สำหรับ Redirect ไปหน้า Dashboard (ถ้ามี)
                // window.location.href = '../pages/dashboard.html';
            } else {
                throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            showToast(error.message, 'error');
            passwordInput.value = ''; // เคลียร์รหัสผ่านให้กรอกใหม่
        } finally {
            // คืนค่า UI ปุ่มกลับมาเหมือนเดิม
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    });
});