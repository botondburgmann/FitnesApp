import { useEffect, useState } from "react";

const useFetch = (getter: Function, userID: string, date?:string) => {
    const [fetchState, setFetchState] = useState({
      data: null,
      isPending: true,
      error: null,
    });
  
    useEffect(() => {
      const fetchData = async (): Promise<void> => {
        try {
          const data = await getter(userID, date);
          setFetchState({ data, isPending: false, error: null });
        } catch (error) {
          setFetchState({ data: null, isPending: false, error: "Error fetching data: " + error });
        }
      };
  
      fetchData();
    }, [getter, userID, date]);
  
    return fetchState;
  };
  

export default useFetch;