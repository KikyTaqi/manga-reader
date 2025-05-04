import { useParams, useNavigate } from 'react-router-dom';
import MangaDetail from '../components/MangaDetail';

function MangaDetailPage({ lang }) {
    const { id } = useParams();
    const navigate = useNavigate();
  
    return (
      <MangaDetail
        mangaId={id}
        lang={lang}
        onSelectChapter={(ch) => navigate(`/chapter/${ch.id}/page/1`)}
        onBack={() => navigate('/')}
      />
    );
  }
  

export default MangaDetailPage;
