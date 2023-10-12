import { useEffect, useState } from "react";

const useFetch = (getter: Function, userID: string) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchData =async ():Promise<void> => {
            try {
                const data = await getter(userID);  
                setData(data);
            } catch(error) {
                setError("Error fetching data: " + error);
            } finally{
                setIsPending(false);
            }
        }

        fetchData();
    }, [getter, userID])

    return {data, isPending, error};
}

export default useFetch;