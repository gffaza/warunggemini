import { AUTH_ERROR_CODES, type AuthErrorCode } from "@/domain/constants/error-codes";

interface AuthErrorResult {
  code: AuthErrorCode;
  message: string;
}

export function mapFirebaseAuthError(error: unknown): AuthErrorResult {
  const firebaseError = error as { code?: string; message?: string };

  switch (firebaseError.code) {
    case "auth/popup-closed-by-user":
      return {
        code: AUTH_ERROR_CODES.POPUP_CLOSED,
        message: "Login dibatalkan. Silakan coba lagi ya, Pak.",
      };
    case "auth/invalid-phone-number":
      return {
        code: AUTH_ERROR_CODES.INVALID_PHONE,
        message: "Nomor HP tidak valid. Gunakan format 08xx atau +62.",
      };
    case "auth/invalid-verification-code":
      return {
        code: AUTH_ERROR_CODES.INVALID_OTP,
        message: "Kode OTP salah. Cek SMS lalu coba lagi.",
      };
    case "auth/code-expired":
      return {
        code: AUTH_ERROR_CODES.OTP_EXPIRED,
        message: "Kode OTP sudah kadaluarsa. Kirim ulang kode baru ya.",
      };
    case "auth/too-many-requests":
      return {
        code: AUTH_ERROR_CODES.TOO_MANY_REQUESTS,
        message: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
      };
    case "auth/network-request-failed":
      return {
        code: AUTH_ERROR_CODES.NETWORK,
        message: "Ups, internet sedang lambat. Coba lagi ya, Pak.",
      };
    case "auth/captcha-check-failed":
    case "auth/missing-recaptcha-token":
      return {
        code: AUTH_ERROR_CODES.RECAPTCHA,
        message: "Verifikasi gagal. Muat ulang halaman lalu coba lagi.",
      };
    case "auth/account-exists-with-different-credential":
      return {
        code: AUTH_ERROR_CODES.UNKNOWN,
        message:
          "Akun sudah terdaftar dengan metode lain. Coba login dengan Google atau nomor HP yang sama.",
      };
    default:
      return {
        code: AUTH_ERROR_CODES.UNKNOWN,
        message: "Gagal masuk. Silakan coba lagi ya, Pak.",
      };
  }
}
