import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
type RequestType = { memberId: Id<"members"> };
type ResponseType = Id<"members"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useDeleteMember = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  //const [isPending, setIsPending] = useState<boolean>(false);
  //const [isSuccess, setIsSuccess] = useState<boolean>(false);
  //const [isError, setIsError] = useState<boolean>(false);
  //const [isSettled, setIsSettled] = useState<boolean>(false);

  const isPending = useMemo(() => {
    return state === "pending";
  }, [state]);

  const isSuccess = useMemo(() => {
    return state === "success";
  }, [state]);

  const isError = useMemo(() => {
    return state === "error";
  }, [state]);

  const isSettled = useMemo(() => {
    return state === "settled";
  }, [state]);

  const mutation = useMutation(api.members.removeMember);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setState("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        setState("success");
        return response;
      } catch (error) {
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
        setState("error");
      } finally {
        setState("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return { mutate, data, error, isError, isPending, isSuccess, isSettled };
};
