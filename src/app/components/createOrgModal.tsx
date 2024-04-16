/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import React, { FC } from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  btnText: string;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ btnText, children }) => {
  const openModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal?.showModal();
  };

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
