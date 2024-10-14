import { useQuery } from "@tanstack/react-query"; 
import { client } from "@/lib/hono";

export const useGetAccount = (id?: string) => {
    const query = useQuery({
        enabled: !!id, // Only fetch if id is truthy
        queryKey: ["accounts", id], // Use id as part of the query key for better cache management
        queryFn: async () => {
            if (!id) throw new Error("Account ID is required"); // Early return if id is not provided

            const response = await client.api.accounts[id].$get(); // Adjusted to use id directly

            if (!response.ok) {
                throw new Error("Failed to fetch account"); // Corrected spelling
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query; // Return the query object
};
