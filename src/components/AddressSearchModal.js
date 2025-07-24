import Dialog from "@mui/material/Dialog";
import DaumPostcode from "react-daum-postcode";

const AddressSearchModal = ({ open, onClose, onComplete }) => (
  <Dialog open={open} onClose={onClose}>
    <DaumPostcode
      onComplete={(data) => {
        const fullAddr = data.address;
        onComplete(fullAddr);
        onClose();
      }}
      autoClose
    />
  </Dialog>
);
export default AddressSearchModal;
