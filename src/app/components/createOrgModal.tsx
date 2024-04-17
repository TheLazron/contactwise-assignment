/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import React, { FC, useEffect } from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  btnText: string;
  closeModal: boolean;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  btnText,
  children,
  closeModal,
}) => {
  const openModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal?.showModal();
  };

  const close = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal?.close();
  };

  useEffect(() => {
    if (closeModal) {
      close();
    }
  }, [closeModal]);

  return (
    <>
      <h1 className="cursor-pointer" onClick={openModal}>
        {btnText}
      </h1>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">{children}</div>
      </dialog>
    </>
  );
};

export default ModalWrapper;
