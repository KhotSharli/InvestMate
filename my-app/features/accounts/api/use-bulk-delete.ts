// my-app/features/accounts/api/use-bulk-delete.ts
import { toast } from "sonner"; 
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define response and request types based on your API definition
type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient(); // Fixed typo

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error("Failed to delete accounts"); // Throws error if response is not ok
            }

            return await response.json(); // Parse the JSON only if the response is OK
        },
        onSuccess: () => {
            toast.success("Accounts Deleted");
            queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Correct query key
        },
        onError: () => {
            toast.error("Failed to delete accounts");
        },
    });

    return mutation; // Return the mutation object
};