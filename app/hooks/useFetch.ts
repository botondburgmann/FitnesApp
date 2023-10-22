import { useEffect, useState } from "react";

const useFetch = (getter: Function, userID: string, date?:string, name?:string, musclesWorked?:string[]) => {
    const [fetchState, setFetchState] = useState({
      data: null,
      isPending: true,
      error: null,
    });
  
    useEffect(() => {
      const fetchData = async (): Promise<void> => {
        try {
          const data = await getter(userID, date, name, musclesWorked);
          setFetchState({ data, isPending: false, error: null });
        } catch (error) {
          setFetchState({ data: null, isPending: false, error: "Error fetching data: " + error });
        }
      };
  
      fetchData();
    }, []);
  
    return fetchState;
  };
  

export default useFetch;