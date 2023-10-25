import React from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";

import PropTypes from "prop-types";

import { CloseIcon } from "@/constants/iconConstants.js";
import { closeModal } from "@/features/ui/ui-slice.js";
import useScrollLock from "@/hooks/useScrollLock.jsx";

import {
	BackdropWrapper,
	IconButton,
	ModalHeaderDiv,
	ModalWrapper,
} from "./BaseModal.style.js";

const Backdrop = () => {
	const dispatch = useDispatch();

	return (
		<BackdropWrapper
			className="backdrop"
			onClick={() => dispatch(closeModal())}
		/>
	);
};

const Modal = ({ title, children, bg, hasClose }) => {
	const dispatch = useDispatch();

	const handleClose = () => {
		dispatch(closeModal());
	};

	return (
		<ModalWrapper style={{ backgroundColor: bg }}>
			<ModalHeaderDiv>
				<span>{title}</span>
				{hasClose && (
					<IconButton onClick={handleClose} aria-label="close">
						<CloseIcon />
					</IconButton>
				)}
			</ModalHeaderDiv>
			{children}
		</ModalWrapper>
	);
};

const BaseModal = ({ title = null, children, bg, hasClose = true }) => {
	useScrollLock();

	return (
		<>
			{ReactDOM.createPortal(<Backdrop />, document.getElementById("backdrop"))}
			{ReactDOM.createPortal(
				<Modal title={title} bg={bg} hasClose={hasClose}>
					{children}
				</Modal>,
				document.getElementById("modal"),
			)}
		</>
	);
};

BaseModal.propTypes = {
	children: PropTypes.node.isRequired,
	bg: PropTypes.string.isRequired,
};
Modal.propTypes = {
	children: PropTypes.node.isRequired,
	bg: PropTypes.string.isRequired,
};

export default BaseModal;
