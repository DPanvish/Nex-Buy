import { useApi } from "@/lib/api"
import { CreateReviewData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReviews = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const createReviewMutation = useMutation({
        mutationFn: async(data: CreateReviewData) => {
            const response = await api.post("/reviews", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reviews"]
            });
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        },
    });

    return{
        isCreatingReview: createReviewMutation.isPending,
        createReviewAsync: createReviewMutation.mutateAsync,
    }
};