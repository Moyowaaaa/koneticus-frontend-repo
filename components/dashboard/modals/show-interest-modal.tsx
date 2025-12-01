import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { Clock } from "iconsax-reactjs";
import React, { useState } from "react";

const ShowInterestModal = () => {
  const { showInterestModal: showShowInterestModal, setShowShowInterestModal } =
    useGeneralStateStore();
  const [description, setDescription] = useState("");

  return (
    <>
      <Modal
        open={showShowInterestModal}
        onOpenChange={setShowShowInterestModal}
        title="Show Interest"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Convince project owner......."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none h-55 outline-none border-none ring-0  shadow-none    text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
          />

          <div className="w-full items-center flex justify-between ">
            <ButtonV2
              className="h-[40px]"
              //   onClick={handleSubmit}
              //   disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              <p className="text-[0.875rem]">
                Express interest
                {/* {isSubmitting ? "Sharing..." : "Share your idea"} */}
              </p>
            </ButtonV2>

            <div className="flex items-center gap-1">
              <Clock size={13} className="text-brand-grey" />
              <p className="text-[0.875rem] text-brand-grey">
                <span className="text-brand-black">3</span> requests left this
                month
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShowInterestModal;
