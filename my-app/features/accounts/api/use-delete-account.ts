import { toast } from "sonner";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id: string | undefined) => {
    const queryClinet = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error
    >({
        mutationFn: async () => {
            const response  = await client.api.accounts[":id"]["$delete"]({ param: {id}, });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account Deleted");
            queryClinet.invalidateQueries({  queryKey: ["accounts", {id}] });
            queryClinet.invalidateQueries({  queryKey: ["accounts"] });
        },
        onError: () => {
            toast.error("Failed to delete account");
        },
    });

    return mutation;
};