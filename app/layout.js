import './globals.css';

export const metadata = {
  title: 'Gyaantosh Exams',
  description: 'Previous year papers, notes and MCQ sheets for MP Police, MP SI, SSC and other government exams.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Yatra+One&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
