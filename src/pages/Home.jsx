import { useParams, useLocation } from "react-router-dom";
import MangaList from "../components/MangaList";

function Home({ lang }) {
  const { pageNumber } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  return (
    <MangaList
      lang={lang}
      searchQuery={searchQuery}
      pageNumber={parseInt(pageNumber) || 1}
    />
  );
}

export default Home;
