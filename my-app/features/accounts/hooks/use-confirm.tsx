import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export const useConfirm = (
    title: string,
    message: string
): [() => JSX.Element, () => Promise<boolean>] => {  // Use `boolean` in the Promise signature
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);  // Fix type for `promise` in useState

    const confirm = () => new Promise<boolean>((resolve) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);  // Resolve with `true` for confirmation
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);  // Resolve with `false` for cancellation
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Dialog open={promise !== null} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription> {/* Show message */}
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
};
