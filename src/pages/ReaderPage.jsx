import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Reader from '../components/Reader';
import axios from 'axios';

const ReaderPage = () => {
  const { id, pageNumber } = useParams(); // id = chapterId
  const navigate = useNavigate();
  const location = useLocation(); // ✅ tambahkan ini
  const [mangaId, setMangaId] = useState(null);

  useEffect(() => {
    axios.get(`https://api.mangadex.org/chapter/${id}`).then((res) => {
      const manga = res.data.data.relationships.find((rel) => rel.type === 'manga');
      if (manga) {
        setMangaId(manga.id);
      }
    });
  }, [id]);

  const handleBackToManga = () => {
    const from = location.state?.from;
    if (from) {
      navigate(from); // ✅ balik ke halaman sebelumnya
    } else if (mangaId) {
      navigate(`/manga/${mangaId}`); // fallback jika tidak ada state
    } else {
      navigate(-1); // benar-benar darurat
    }
  };

  return (
    <Reader
      chapterId={id}
      pageNumber={parseInt(pageNumber, 10)}
      onPageChange={(newPage) => navigate(`/chapter/${id}/page/${newPage}`, {
        state: { from: location.state?.from }, // penting: teruskan state saat berpindah halaman
      })}
      onBackToManga={handleBackToManga}
    />
  );
};

export default ReaderPage;
