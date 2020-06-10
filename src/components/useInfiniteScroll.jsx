import { useEffect, useContext } from "react";
import Context from "./Context";

function useInfiniteScroll() {
  const ctx = useContext(Context);

  const setIsFetching = (data) =>
    ctx.dispatch({ type: "setIsFetching", payload: data });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.getElementById("explore-left").offsetHeight ||
      ctx.isFetching
    )
      return;
    setIsFetching(true);
  };

  return [ctx.isFetching, setIsFetching];
}

export default useInfiniteScroll;
