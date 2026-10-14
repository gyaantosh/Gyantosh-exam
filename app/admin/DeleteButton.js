'use client';

export default function DeleteButton({ title }) {
  return (
    <button
      type="submit"
      className="btn btn-line btn-sm danger"
      onClick={(e) => {
        if (!window.confirm(`"${title}" hamesha ke liye hata dein? Ye wapas nahi aayega.`)) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
