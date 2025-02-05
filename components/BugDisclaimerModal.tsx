import { Button, Modal } from "antd";
import React, { useState } from "react";

const BugDisclaimerModal: React.FC = () => {
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(true);

  const closeModal = () => {
    setIsDisclaimerModalOpen(false);
  };

  return (
    <Modal
      title="Hellou lol"
      open={isDisclaimerModalOpen}
      onOk={closeModal}
      onCancel={closeModal}
      footer={[
        <Button key="ok" type="primary" onClick={closeModal}>
          Ok
        </Button>,
      ]}
    >
      <p>
        Due to a known bug, your study plan might get lost when the new semester
        starts. I haven&apos;t gotten around to fixing this yet, so you might
        have to redo your study plan. Please screenshot it after you&apos;re
        finished lol
      </p>
      <p>If you encouter any other bugs, please let me know :)</p>
      <p>Deeply sorry for the inconvenience</p>
      <p>- Linus</p>
    </Modal>
  );
};
export default BugDisclaimerModal;
