import { toast } from "sonner";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
    const queryClinet = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async (json) => {
            const response  = await client.api.accounts.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account Created");
            queryClinet.invalidateQueries({  queryKey: ["accounts"] });
        },
        onError: () => {
            toast.error("Failed to create account");
        },
    });

    return mutation;
};