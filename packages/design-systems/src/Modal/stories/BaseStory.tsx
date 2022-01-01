/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { Story } from "@storybook/react";
import Modal, { Props as ModalProps } from "../Modal";

const BaseStory: Story<ModalProps> = (args) => {
  const { children } = args;
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  console.log(isOpen);
  return (
    <div>
      <button type="button" onClick={openModal}>
        open modal
      </button>

      <button type="button" onClick={closeModal}>
        close modal
      </button>
      <Modal isOpen={isOpen}>{children}</Modal>
    </div>
  );
};

export default BaseStory;
