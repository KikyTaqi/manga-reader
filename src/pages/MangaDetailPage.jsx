import { useParams, useNavigate, useLocation } from "react-router-dom";
import MangaDetail from "../components/MangaDetail";

function MangaDetailPage({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MangaDetail
      mangaId={id}
      lang={lang}
      onSelectChapter={(ch) =>
        navigate(`/chapter/${ch.id}/page/1`, {
          state: {
            from: location.pathname, // simpan asal halaman detail manga
          },
        })
      }
      onBack={() => navigate("/")}
    />
  );
}

export default MangaDetailPage;
