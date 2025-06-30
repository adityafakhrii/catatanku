import Swal from 'sweetalert2';

class NotificationManager {
    static showSuccess(message, title = 'Berhasil!') {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            customClass: {
                popup: 'animate__animated animate__slideInRight'
            }
        });
    }

    static showError(message, title = 'Terjadi Kesalahan!') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444',
            customClass: {
                popup: 'animate__animated animate__shakeX'
            }
        });
    }

    static showWarning(message, title = 'Peringatan!') {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            customClass: {
                popup: 'animate__animated animate__slideInRight'
            }
        });
    }

    static showInfo(message, title = 'Informasi') {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            customClass: {
                popup: 'animate__animated animate__slideInRight'
            }
        });
    }

    static async showConfirmation(message, title = 'Konfirmasi') {
        const result = await Swal.fire({
            icon: 'question',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#ef4444',
            customClass: {
                popup: 'animate__animated animate__zoomIn'
            }
        });

        return result.isConfirmed;
    }

    static showLoading(message = 'Memproses...') {
        return Swal.fire({
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            customClass: {
                popup: 'animate__animated animate__fadeIn'
            }
        });
    }

    static hideLoading() {
        Swal.close();
    }
}

export default NotificationManager;