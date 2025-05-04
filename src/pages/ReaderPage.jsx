import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Reader from '../components/Reader';
import axios from 'axios';

const ReaderPage = () => {
  const { id, pageNumber } = useParams(); // id = chapterId
  const navigate = useNavigate();
  const [mangaId, setMangaId] = useState(null);

  useEffect(() => {
    // Ambil mangaId dari chapter
    axios.get(`https://api.mangadex.org/chapter/${id}`).then((res) => {
      const manga = res.data.data.relationships.find((rel) => rel.type === 'manga');
      if (manga) {
        setMangaId(manga.id);
      }
    });
  }, [id]);

  const handleBackToManga = () => {
    if (mangaId) {
      navigate(`/manga/${mangaId}`);
    } else {
      navigate(-1); // fallback
    }
  };

  return (
    <Reader
      chapterId={id}
      pageNumber={parseInt(pageNumber, 10)}
      onPageChange={(newPage) => navigate(`/chapter/${id}/page/${newPage}`)}
      onBackToManga={handleBackToManga}
    />
  );
};

export default ReaderPage;
