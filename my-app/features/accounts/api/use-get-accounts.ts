import { useQuery } from "@tanstack/react-query"; 
import { client } from "@/lib/hono"; // Ensure this path is correct

export const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"], // Unique key for this query
        queryFn: async () => {
            const response = await client.api.accounts.$get(); // This should now work if accounts is defined

            if (!response.ok) {
                throw new Error("Failed to fetch accounts"); // Note the typo fix
            }

            const { data } = await response.json();
            return data; // Returning the fetched accounts
        },
    });

    return query; // Returning the query object
};
