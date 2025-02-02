import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Header from "@/components/Header/Header/Header";

const Root = () => {
	const { isLoading, user } = useSelector((state) => state.auth);

	if (isLoading && !user) {
		return <p>Loading,,,</p>;
	}

	if (!user) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default Root;
