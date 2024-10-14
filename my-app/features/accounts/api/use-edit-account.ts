import { toast } from "sonner"; 
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id: string | undefined) => {
    const queryClient = useQueryClient(); // Fixed typo: 'queryClinet' to 'queryClient'

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            if (!id) {
                throw new Error("Account ID is required"); // Early return if id is not provided
            }

            const response = await client.api.accounts[id].$patch({ json }); // Use id directly

            if (!response.ok) {
                throw new Error("Failed to update account"); // Error handling for failed requests
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account updated successfully"); // Updated success message
            queryClient.invalidateQueries({ queryKey: ["accounts", { id }] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: () => {
            toast.error("Failed to update account"); // Updated error message
        },
    });

    return mutation; // Return the mutation object
};
