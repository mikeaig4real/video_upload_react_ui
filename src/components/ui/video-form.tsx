"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  uploadedVideoSchema,
  type UploadedVideo,
} from "@/types/uploaded_video";
import { CustomForm, type FormFieldsDefault, type HandleSubmitType } from "@/components/CustomForm";

export interface VideoFormProps {
  video: UploadedVideo;
  fields: ({
    name: keyof UploadedVideo;
  } & FormFieldsDefault)[];
  isOpen: boolean;
  onClose: () => void;
  onSave?: HandleSubmitType;
}

export default function VideoForm({
  video,
  fields,
  isOpen,
  onClose,
  onSave,
}: VideoFormProps) {
  function handleSubmit(data: object) {
    if (onSave) {
      onSave(data);
    }
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "20%", opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-96 max-h-[80vh] overflow-y-auto shadow-2xl dark:bg-black">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Change Metadata
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CustomForm
                  handleSubmit={handleSubmit}
                  zodSchema={uploadedVideoSchema}
                  defaultValues={{ ...video }}
                  formFields={fields}
                  buttons={[
                    {
                      label: "Submit",
                      type: "submit" as const,
                      formChangeTriggered: true,
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
